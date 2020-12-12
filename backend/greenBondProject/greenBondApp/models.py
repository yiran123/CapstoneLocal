from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator, RegexValidator
import datetime


class Contractor(models.Model):
    name = models.CharField(max_length=1000)
    description = models.CharField(max_length=5000)

    def __str__(self):
        return self.name


class SDG(models.Model):
    name = models.CharField(max_length=1000)
    official_description = models.CharField(max_length=10000)
    original_description = models.CharField(max_length=10000)


class Project(models.Model):
    name = models.CharField(max_length=1000)
    project_number = models.CharField(max_length=100)
    description = models.CharField(max_length=10000, blank=True)
    sdgs = models.ManyToManyField(SDG)
    contractor = models.ForeignKey(Contractor, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Bond(models.Model):
    ENTERPRISE_TYPES = [
        ('Water', 'Water'),
        ('Power', 'Power'),
        ('Wastewater', 'Wastewater'),
    ]
    # TODO: VERIFY
    BOND_TYPES = [
        ('Revenue', 'Revenue'),
        ('Refunding', 'Refunding'),
    ]
    ALPHA_REGEX = RegexValidator(r'^[A-Z]$')

    name = models.CharField(max_length=200)
    enterprise = models.CharField(max_length=100, choices=ENTERPRISE_TYPES)
    issue_year = models.IntegerField(validators=[MinValueValidator(1000), MaxValueValidator(3000)])
    # TODO: verify
    series = models.CharField(max_length=1, validators=[ALPHA_REGEX])
    bond_type = models.CharField(max_length=100, choices=BOND_TYPES)
    CUSIP = models.CharField(max_length=100)
    avg_mature_rate = models.DecimalField(max_digits=5, decimal_places=4)
    verifier = models.CharField(max_length=200, default='')
    maturity_date = models.DateField(default=datetime.date.today)
    projects = models.ManyToManyField(Project, through='FinancialInfo')

    def ___str__(self):
        return self.name


class FinancialInfo(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    bond = models.ForeignKey(Bond, on_delete=models.CASCADE)
    use_of_proceeds = models.DecimalField(max_digits=20, decimal_places=2, default=0, null=True)
    prior_year_spending = models.DecimalField(max_digits=20, decimal_places=2, default=0, null=True)
    recent_year_spending = models.DecimalField(max_digits=20, decimal_places=2, default=0, null=True)

    class Meta:
        db_table = 'greenBondApp_bond_projects'


class TimeSeries(models.Model):
    PROJECT_STATUS = [
        ('Built', 'Built'),
        ('Upgraded', 'Upgraded'),
        ('Under Construction', 'Under Construction'),
        ('Not Started', 'Not Started'),
    ]

    year = models.IntegerField(validators=[MinValueValidator(1000), MaxValueValidator(3000)])
    project = models.ForeignKey(Project, on_delete=models.CASCADE)

    status = models.CharField(max_length=100, choices=PROJECT_STATUS)
    household_connections_count = models.PositiveIntegerField()
    people_with_access_to_utilities_count = models.PositiveIntegerField()
    people_benefiting_count = models.PositiveIntegerField()
    
    water_reduction = models.DecimalField(max_digits=20, decimal_places=2, default=0, null=True)
    water_catchment = models.DecimalField(max_digits=20, decimal_places=2, default=0, null=True)

    ghg_emissions_business_as_usual = models.DecimalField(max_digits=20, decimal_places=2, default=0, null=True)
    ghg_emissions_actual_emissions = models.DecimalField(max_digits=20, decimal_places=2, default=0, null=True)
    