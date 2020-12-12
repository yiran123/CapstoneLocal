from rest_framework import serializers
from django.db.models import Sum
from decimal import Decimal

from greenBondApp.models import SDG, Project, Bond, FinancialInfo, Contractor, TimeSeries


class SDGSerializer(serializers.ModelSerializer):
    class Meta:
        model = SDG
        fields = ('id', 'name', 'official_description', 'original_description')


class ContractorSerializerForCreation(serializers.ModelSerializer):
    class Meta:
        model = Contractor
        fields = ('name', 'description')

    def create(self, validated_data):
        return Contractor.objects.create(
            name=validated_data['name'],
            description=validated_data['description']
        )


class ProjectSerializerForDetail(serializers.ModelSerializer):
    def get_associated_bonds(self, obj):
        """Get info of bonds associated to this project.
        """
        return [BondSerializerForList(bond).data for bond in obj.bond_set.all()]

    def get_financial_info(self, obj):
        return [FinancialInfoSerializerForProject(financial_info).data \
            for financial_info in obj.financialinfo_set.all()]

    def get_climate_impact(self, obj):
        series_dict = dict()
        for time_series in obj.timeseries_set.all():
            series_dict[time_series.year] = TimeSeriesSerializer(time_series).data

        return series_dict

    associated_bonds = serializers.SerializerMethodField()
    financial_info = serializers.SerializerMethodField()
    climate_impact = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = ('id', 'name', 'project_number', 'description', 'sdgs', 'associated_bonds', \
            'financial_info', 'climate_impact')


class ProjectSerializerForList(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ('id', 'name', 'project_number', 'description', 'sdgs')


class ProjectSerializerForCreation(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ('name', 'project_number', 'description')
    
    def create(self, validated_data):
        project =  Project.objects.create(
            name=validated_data['name'],
            project_number=validated_data['project_number'],
            description=validated_data['description'],
            contractor=validated_data['contractor']
        )
        for sdg in validated_data['sdgs']:
            project.sdgs.add(sdg)
        
        project.save()
        return project


class BondSerializerForList(serializers.ModelSerializer):
    def get_project_counts(self, obj):
        return obj.projects.count()
    
    def get_use_of_proceeds(self, obj):
        return obj.financialinfo_set.aggregate(use_of_proceeds=Sum('use_of_proceeds'))['use_of_proceeds']
    
    def get_sdgs(self, obj):
        # Get SDG frequencies.
        sdg_freq = {}
        for project in obj.projects.all():
            for sdg in project.sdgs.all():
                sdg_freq[sdg.id] = sdg_freq.get(sdg.id, 0) + 1

        sdg_freq_list = [(k, v) for k, v in sdg_freq.items()]
        sdg_freq_list.sort(key=lambda tup: tup[1], reverse=True)

        # Return top 3 sdg.
        return [sdg for sdg, _ in sdg_freq_list[:min(3, len(sdg_freq_list))]]

    def get_maturity_year(self, obj):
        return obj.maturity_date.year

    project_counts = serializers.SerializerMethodField()
    use_of_proceeds = serializers.SerializerMethodField()
    sdgs = serializers.SerializerMethodField()
    maturity_year = serializers.SerializerMethodField()
    
    class Meta:
        model = Bond
        fields = ('id', 'name', 'enterprise', 'issue_year', 'series',
         'bond_type', 'CUSIP', 'avg_mature_rate', 'project_counts', 'use_of_proceeds', 'sdgs', 'maturity_year')


class BondSerializerForDetail(serializers.ModelSerializer):
    def get_projects(self, obj):
        """Serialize project.
        """
        # Use of proceeds.
        # Dict: {id, serialization of the project}
        #       key:    project.id
        #       value:  dict(serialization of the project)
        uop = dict()

        # Get financial info for the project and bond.
        for project in obj.projects.values('id', 'financialinfo__use_of_proceeds',\
            'financialinfo__prior_year_spending', 'financialinfo__recent_year_spending'):

            uop[project['id']] = {
                'id':                   project['id'],
                'use_of_proceeds':      project['financialinfo__use_of_proceeds'],
                'prior_spending':       project['financialinfo__prior_year_spending'],
                'recent_year_spending': project['financialinfo__recent_year_spending']
            }

        # Get the rest of the projects' fields;
        # And update the dictionary.
        for project in obj.projects.all():
            uop[project.id].update(dict(ProjectSerializerForList(project).data))

        # Return a list of the serializations.
        return uop.values()

    def get_constractors(self, obj):
        """Get the contractors related to this bond, and the "Use of Proceeds" related to the contractor.
        """
        contractors = dict()
        for project in obj.projects.values('id', 'contractor__name', 'financialinfo__use_of_proceeds', 'contractor__description'):
            contractor_name = project['contractor__name']
            contractor_description = project['contractor__description']
            if contractor_name not in contractors:
                contractors[contractor_name] = {
                    'description': contractor_description,
                    'uop': 0.0
                }

            contractors[contractor_name]['uop'] = contractors[contractor_name]['uop'] \
                + float(project['financialinfo__use_of_proceeds'])

        return {k: v for k, v in sorted(contractors.items(), key=lambda item: -item[1]['uop'])}

    def get_financial_info(self, obj):
        return {
            'use_of_proceeds':        obj.financialinfo_set.aggregate(use_of_proceeds=Sum('use_of_proceeds'))['use_of_proceeds'],
            'prior_year_spending':    obj.financialinfo_set.aggregate(prior_year_spending=Sum('prior_year_spending'))['prior_year_spending'],
            'recent_year_spending':   obj.financialinfo_set.aggregate(recent_year_spending=Sum('recent_year_spending'))['recent_year_spending'],
            'maturity_date':          obj.maturity_date,
            'avg_mature_rate':        obj.avg_mature_rate
        }

    def get_climate_impact(self, obj):
        climate_impact = []
        for time_series in TimeSeries.objects.filter(project__id__in=obj.projects.values('id')):
            climate_impact.append(TimeSeriesSerializer(time_series).data)
        
        return climate_impact

    projects = serializers.SerializerMethodField()
    constractors = serializers.SerializerMethodField()
    financial_info = serializers.SerializerMethodField()
    climate_impact = serializers.SerializerMethodField()

    class Meta:
        model = Bond
        fields = ('id', 'name', 'enterprise', 'issue_year', 'series', 'bond_type', 'CUSIP',
         'avg_mature_rate', 'projects', 'constractors', 'financial_info', 'climate_impact')
        #depth = 1


class BondSerializerForCreation(serializers.ModelSerializer):
    maturity_date = serializers.DateField(input_formats=['%m/%d/%Y',])

    class Meta:
        model = Bond
        fields = ('name', 'enterprise', 'issue_year', 'series' , 'bond_type', 'CUSIP', \
            'avg_mature_rate', 'maturity_date', 'verifier')
    
    def create(self, validated_data):
        return Bond.objects.create(
            name=validated_data['name'],
            enterprise=validated_data['enterprise'],
            issue_year=validated_data['issue_year'],
            series=validated_data['series'],
            bond_type=validated_data['bond_type'],
            CUSIP=validated_data['CUSIP'],
            avg_mature_rate=validated_data['avg_mature_rate'],
            maturity_date=validated_data['maturity_date'],
            verifier=validated_data['maturity_date']
        )


class FinancialInfoSerializerForCreation(serializers.ModelSerializer):
    class Meta:
        model = FinancialInfo
        fields = ('use_of_proceeds', 'prior_year_spending', 'recent_year_spending')

    def create(self, validated_data):
        return FinancialInfo.objects.create(
            project=validated_data['project'],
            bond=validated_data['bond'],
            use_of_proceeds=validated_data['use_of_proceeds'],
            prior_year_spending=validated_data['prior_year_spending'],
            recent_year_spending=validated_data['recent_year_spending']
        )


class FinancialInfoSerializerForProject(serializers.ModelSerializer):
    def get_project(self, obj):
        return obj.project.name

    def get_bond(self, obj):
        return obj.bond.name

    project = serializers.SerializerMethodField()
    bond = serializers.SerializerMethodField()

    class Meta:
        model = FinancialInfo
        fields = ('project', 'bond', 'use_of_proceeds', 'prior_year_spending', \
            'recent_year_spending')


class TimeSeriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSeries
        fields = ('year', 'water_reduction', 'water_catchment', \
            'ghg_emissions_business_as_usual', 'ghg_emissions_actual_emissions', \
            'household_connections_count', 'people_with_access_to_utilities_count', \
            'people_benefiting_count', 'status')


class TimeSeriesSerializerForCreation(serializers.ModelSerializer):
    class Meta:
        model = TimeSeries
        fields = ('year', 'water_reduction', 'water_catchment', \
            'ghg_emissions_business_as_usual', 'ghg_emissions_actual_emissions', \
            'household_connections_count', 'people_with_access_to_utilities_count', \
            'people_benefiting_count', 'status')

    def create(self, validated_data):
        return TimeSeries.objects.create(
            project=validated_data['project'],
            year=validated_data['year'],
            water_reduction=validated_data['water_reduction'],
            water_catchment=validated_data['water_catchment'],
            ghg_emissions_business_as_usual=validated_data['ghg_emissions_business_as_usual'],
            ghg_emissions_actual_emissions=validated_data['ghg_emissions_actual_emissions'],
            household_connections_count=validated_data['household_connections_count'],
            people_with_access_to_utilities_count=validated_data['people_with_access_to_utilities_count'],
            people_benefiting_count=validated_data['people_benefiting_count'],
            status=validated_data['status']
        )
