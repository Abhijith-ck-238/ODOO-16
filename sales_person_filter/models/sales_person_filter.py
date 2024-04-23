from odoo import fields, models, api, _


class CrmLead(models.Model):
    _inherit = 'crm.lead'

    sales_person = fields.Many2one("res.users")

    @api.model
    def get_partners(self):
        return self.env['res.users'].search_read([("share", "=", False)])

    @api.model
    def get_salesperson(self, partner_id):
        return self.env['res.users'].search_read([('id', '=', partner_id)])

    @api.model
    def get_action(self,sales_person_id, sales_person):
        filter_view = self.env.ref('sales_person_filter.crm_sales_person_filter')
        arch_base = """<xpath expr="//filter[@name='assigned_to_me']" position="before">
                    <filter string="SalesPerson contains %s" name="salesPersonCustom" domain="[('user_id', 'ilike', '%s')]"/>
                    </xpath>""" % (sales_person[0].get('name'),
                                   sales_person[0].get('name'))
        filter_view.write({
            'arch_base': arch_base,
        })
        return_value = {
            'type': 'ir.actions.act_window',
            'name': _('crm pipeline'),
            'res_model': 'crm.lead',
            'target': 'current',
            'view_mode': "list",
            'domain': [],
            'views': [[False, "tree"], [False, "kanban"], [False, "calendar"],
                      [False, "pivot"],
                      [False, "graph"], [False, "activity"], [False, "form"]],
            'context': {'search_default_salesPersonCustom': 1},
        }
        return return_value
