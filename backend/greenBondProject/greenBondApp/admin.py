from django.contrib import admin

from .models import Project, SDG, Bond, FinancialInfo, Contractor, TimeSeries

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    filter_horizontal = ('sdgs',)

@admin.register(Bond)
class BondAdmin(admin.ModelAdmin):
    #filter_horizontal = ('projects',)
    pass

# @admin.register(UseOfProceeds)
# class UseOfProceedsAdmin(admin.ModelAdmin):
#     filter_horizontal = ('bond', 'project',)

admin.site.register(SDG)
admin.site.register(FinancialInfo)
admin.site.register(Contractor)
admin.site.register(TimeSeries)
