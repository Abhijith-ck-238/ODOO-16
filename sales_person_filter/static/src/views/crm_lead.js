/** @odoo-module */
import { ListController } from "@web/views/list/list_controller";
import { ListRenderer } from "@web/views/list/list_renderer";
import { registry } from '@web/core/registry';
import { listView } from '@web/views/list/list_view';
import { useService } from "@web/core/utils/hooks";
import core from 'web.core';
import { onWillStart, onMounted,useRef } from "@odoo/owl";



var QWeb = core.qweb;
var _t = core._t;


export class CrmListRenderer extends ListRenderer {
setup() {
    super.setup();
    this.actionService = useService("action");
    this.ormService = useService('orm');
    this.users = [];
    var self = this;
    this.value;
    this.selectionValue = useRef('salesPerson')
    onMounted(async (ev) => {
    console.log('mount',this.selectionValue.el.value)
    });
    onWillStart(async () => {
    await this.getUsers();
    });
}

   async getUsers() {
       const users = await this.ormService.call('crm.lead','get_partners');
       this.users = users;
   }

   async OnPersonChange(ev) {
       var sales_person_id = parseInt(ev.target.value)
       this.value = ev.target.value
       const sales_person = await this.ormService.call('crm.lead','get_salesperson',[sales_person_id]);
       const action = await this.ormService.call('crm.lead','get_action',[sales_person_id,sales_person])
       this.actionService.doAction(action)
       this.actionService.doAction({
            type: "ir.actions.client",
            tag: "reload",
       });
       this.selectionValue.el.value = this.value

   }
}

CrmListRenderer.template = 'sales_person_filter.ListRenderer';

registry.category("views").add("selection_in_tree",
 {
   ...listView,
   Renderer: CrmListRenderer,
});

















///** @odoo-module **/
//
//import { registry } from "@web/core/registry";
//import { useBus, useService } from "@web/core/utils/hooks";
//import { ControlPanel } from "@web/search/control_panel/control_panel";
//import { ReceptionReportTable } from "../reception_report_table/stock_reception_report_table";
//
//const { Component, onWillStart, useState } = owl;
//
//export class CrmListController extends Component {
//    setup() {
//        this.controlPanelDisplay = {
//            "top-left": true,
//            "top-right": true,
//            "bottom-left": false,
//            "bottom-right": false,
//        };
////        this.ormService = useService("orm");
////        this.actionService = useService("action");
////        this.reportName = "stock.report_reception";
////        const defaultDocIds = Object.entries(this.context).find(([k,v]) => k.startsWith("default_"));
////        this.contextDefaultDoc = { field: defaultDocIds[0], ids: defaultDocIds[1] };
////        this.state = useState({
////            sourcesToLines: {},
//        });
//        useBus(this.env.bus, "update-assign-state", (ev) => this._changeAssignedState(ev.detail));
//
////        onWillStart(async () => {
////            this.data = await this.getReportData();
////            this.state.sourcesToLines = this.data.sources_to_lines;
////        });
//    }
//    async printbtn(){
//   console.log('btnnn')
//   }
//
////    async getReportData() {
////        const args = [
////            this.contextDefaultDoc.ids,
////            { context: this.context, report_type: "html" },
////        ];
////        return this.ormService.call(
////            "report.stock.report_reception",
////            "get_report_data",
////            args,
////            { context: this.context }
////        );
////    }
////
////    //---- Handlers ----
////
////    async onClickAssignAll() {
////        const moveIds = [];
////        const quantities = [];
////        const inIds = [];
////
////        for (const lines of Object.values(this.state.sourcesToLines)) {
////            for (const line of lines) {
////                if (line.is_assigned) continue;
////                moveIds.push(line.move_out_id);
////                quantities.push(line.quantity);
////                inIds.push(line.move_ins);
////            }
////        }
////
////        await this.ormService.call(
////            "report.stock.report_reception",
////            "action_assign",
////            [false, moveIds, quantities, inIds],
////        );
////        this._changeAssignedState({ isAssigned: true });
////    }
////
////    async onClickTitle(docId) {
////        return this.actionService.doAction({
////            type: "ir.actions.act_window",
////            res_model: this.data.doc_model,
////            res_id: docId,
////            views: [[false, "form"]],
////            target: "current",
////        });
////    }
////
////    onClickPrint() {
////        return this.actionService.doAction({
////            type: "ir.actions.report",
////            report_type: "qweb-pdf",
////            report_name: `${this.reportName}/?context={"${this.contextDefaultDoc.field}": ${JSON.stringify(this.contextDefaultDoc.ids)}}`,
////            report_file: this.reportName,
////        });
////    }
////
////    onClickPrintLabels() {
////        const reportFile = 'stock.report_reception_report_label';
////        const modelIds = [];
////        const quantities = [];
////
////        for (const lines of Object.values(this.state.sourcesToLines)) {
////            for (const line of lines) {
////                if (!line.is_assigned) continue;
////                modelIds.push(line.move_out_id);
////                quantities.push(Math.ceil(line.quantity) || 1);
////            }
////        }
////        if (!modelIds.length) {
////            return;
////        }
////
////        return this.actionService.doAction({
////            type: "ir.actions.report",
////            report_type: "qweb-pdf",
////            report_name: `${reportFile}?docids=${modelIds}&quantity=${quantities}`,
////            report_file: reportFile,
////        });
////    }
////
////    //---- Utils ----
////
////    _changeAssignedState(options) {
////        const { isAssigned, tableIndex, lineIndex } = options;
////
////        for (const [tabIndex, lines] of Object.entries(this.state.sourcesToLines)) {
////            if (tableIndex && tableIndex != tabIndex) continue;
////            lines.forEach(line => {
////                if (isNaN(lineIndex) || lineIndex == line.index) {
////                    line.is_assigned = isAssigned;
////                }
////            });
////        }
////    }
////
////    //---- Getters ----
////
////    get context() {
////        return this.props.action.context;
////    }
////
////    get hasContent() {
////        return this.data.sources_to_lines && Object.keys(this.data.sources_to_lines).length > 0;
////    }
////
////    get isAssignAllDisabled() {
////        return Object.values(this.state.sourcesToLines).every(lines => lines.every(line => line.is_assigned || !line.is_qty_assignable));
////    }
////
////    get isPrintLabelDisabled() {
////        return Object.values(this.state.sourcesToLines).every(lines => lines.every(line => !line.is_assigned));
////    }
//}
//
//CrmListController.components = {
//    ControlPanel,
//
//};
//CrmListController.template = "selection_sales_person.ListView.Buttons";
//
//registry.category("actions").add("reception_report", CrmListController);
//
//






