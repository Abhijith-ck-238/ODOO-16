{
    'name': 'SalesPerson_filter',
    'version': '16.0.1.0.0',
    'depends': ['base', 'crm', 'sale'],
    'author': 'ABD',
    'category': 'Human Resources',
    'description': "This module adds filter in crm",
    'data': [
        'views/crm_lead.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'sales_person_filter/static/src/css/sales_person_filter.css',
            'sales_person_filter/static/src/views/crm_lead.xml',
            'sales_person_filter/static/src/views/crm_lead.js',
        ]
    }

}
