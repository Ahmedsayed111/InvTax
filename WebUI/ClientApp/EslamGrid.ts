


//----------------------------------------------------------------ESGrid--------------------------------------


//class I_D_UOM {
//    constructor() {
//        this.UomID = 0;
//        this.UomCode = "";
//        this.DescA = "";
//        this.DescE = "";
//        this.CompCode = 0;
//        this.Remarks = "";
//        this.CreatedAt = "";
//        this.CreatedBy = "";
//        this.UpdatedAt = "";
//        this.UpdatedBy = "";
//        this.StatusFlag = "";
//    }
//    public UomID: number;
//    public UomCode: string;
//    public DescA: string;
//    public DescE: string;
//    public CompCode: number;
//    public Remarks: string;
//    public CreatedAt: string;
//    public CreatedBy: string;
//    public UpdatedAt: string;
//    public UpdatedBy: string;
//    public StatusFlag: string;
//}


class ESGrid {
    constructor() {
        this.ESG = new ESG();
        this.Column = new Array<Column>();
    }
    public ESG: ESG;
    public Column: Array<Column>;
}


class ESG {
    constructor() {
        this.PrimaryKey = "";
        this.NameTable = "";
        this.Save = true;
        this.Back = true;
        this.DeleteRow = true;
        this.CopyRow = true;
        this.Add = true;
        this.Edit = true;
        this.SelectedKey;
        this.LastCounter = 0;
        this.LastCounterAdd = 0;
        this.RowCnt = 0;
        this.Right = true;
        this.object = new Object();
        this.TotalModel = new Object();
        this.Model = new Array<any>();
        this.OnfunctionSave;
        this.OnfunctionTotal;
        this.OnRowDoubleClicked;


    }
    public PrimaryKey: string;
    public NameTable: string;
    public Save: boolean;
    public Back: boolean;
    public DeleteRow: boolean;
    public CopyRow: boolean;
    public Add: boolean;
    public Edit: boolean;
    public SelectedKey: any;
    public LastCounter: number;
    public LastCounterAdd: number;
    public RowCnt: number;
    public Right: boolean;
    public object: any
    public TotalModel: any
    public Model: Array<any>;
    public OnfunctionSave?: () => void;
    public OnfunctionTotal?: () => void;
    public OnRowDoubleClicked?: () => void;

}

class Column {
    constructor() {
        this.style = "width: 100%";
        this.title = "";
        this.Name = "";
        this.value = "";
        this.Type = "text";
        this.visible = true;
        this.Edit = true;
        this.Validation = new Valid_Con;
        this.ColumnType = new ControlEvents;

    }
    public style?: string;
    public title?: string;
    public Name?: string;
    public value?: string;
    public Type?: string;
    public visible?: boolean;
    public Edit?: boolean;
    public Validation?: Valid_Con;
    public ColumnType?: ControlEvents;
}



class Valid_Con {
    constructor() {
        this.valid = false;
        this.conation = new Con;
        this.Con_Value = '';
        this.Mess = '';
    }
    public valid: boolean;
    public conation: Con;
    public Con_Value: string;
    public Mess: string;

}

class Con {
}


class ControlEvents {
    constructor() {
        this.NameType = '';
        this.textField = '';
        this.onclick;
        this.onkeyup;
        this.onchange;
        this.dataSource;
    }
    public NameType: string;
    public textField: string;
    public onclick?: () => void;
    public onkeyup?: () => void;
    public onchange?: () => void;
    public dataSource: Array<any>
}


interface String {

    Get_Cheak: (Grid: ESGrid) => boolean;
    Get_Num: (Grid: ESGrid) => number;
    Get_Val: (Grid: ESGrid) => string;
    Set_Val: (value: string, Grid: ESGrid) => string;
    html: (value: string, Grid: ESGrid) => string;
    append: (value: string, Grid: ESGrid) => string;
}


var Valid = {

    Set: function (valid: boolean, Mess?: string , conation?: Con, Value?: string): Valid_Con {

        var Valid_Co: Valid_Con = new Valid_Con();


        Valid_Co.valid = valid
        Valid_Co.conation = conation
        Valid_Co.Con_Value = Value
        Valid_Co.Mess = Mess

        return Valid_Co;

    },
}


namespace ControlType {


    String.prototype.Get_Val = function (Grid: ESGrid): string {
        let NameFild = this;
        let value = $('#' + Grid.ESG.NameTable + '_' + NameFild + Grid.ESG.RowCnt + '').val()
        return (value);
    };

    String.prototype.Set_Val = function (value: any, Grid: ESGrid): any {
        let NameFild = this;
        if (value == true || value == false) {

            $('#' + Grid.ESG.NameTable + '_' + NameFild + Grid.ESG.RowCnt + '').prop("checked", value);
        } else {

            $('#' + Grid.ESG.NameTable + '_' + NameFild + Grid.ESG.RowCnt + '').val(value)
        }
        return (value);
    };

    String.prototype.Get_Num = function (Grid: ESGrid): number {
        let NameFild = this;
        let value = $('#' + Grid.ESG.NameTable + '_' + NameFild + Grid.ESG.RowCnt + '').val()
        return (Number(value));
    };

    String.prototype.Get_Cheak = function (Grid: ESGrid): boolean {
        debugger
        let NameFild = this;
        let value: boolean = $('#' + Grid.ESG.NameTable + '_' + NameFild + Grid.ESG.RowCnt + '').is(":checked")
        return (value);
    };

    String.prototype.html = function (value: any, Grid: ESGrid): any {
        let NameFild = this;
       
            $('#' + Grid.ESG.NameTable + '_' + NameFild + Grid.ESG.RowCnt + '').html(value)
        
        return (value);
    };
    String.prototype.append = function (value: any, Grid: ESGrid): any {
        let NameFild = this;
       
            $('#' + Grid.ESG.NameTable + '_' + NameFild + Grid.ESG.RowCnt + '').append(value)
        
        return (value);
    };




    var ControlEvent: ControlEvents = new ControlEvents();

    export function Input(onchange?: () => void, onkeyup?: () => void, onclick?: () => void): ControlEvents {

        ControlEvent = new ControlEvents();

        ControlEvent.onchange = onchange;
        ControlEvent.onkeyup = onkeyup;
        ControlEvent.onclick = onclick;
        ControlEvent.dataSource = null;
        ControlEvent.NameType = 'Input';

        return ControlEvent;
    }


    export function checkbox(onchange?: () => void, onkeyup?: () => void, onclick?: () => void): ControlEvents {
        ControlEvent = new ControlEvents();

        ControlEvent.onchange = onchange;
        ControlEvent.onkeyup = onkeyup;
        ControlEvent.onclick = onclick;
        ControlEvent.dataSource = null;
        ControlEvent.NameType = 'checkbox';

        return ControlEvent;
    }


    export function Button(onchange?: () => void, onkeyup?: () => void, onclick?: () => void): ControlEvents {
        ControlEvent = new ControlEvents();
        ControlEvent.onchange = onchange;
        ControlEvent.onkeyup = onkeyup;
        ControlEvent.onclick = onclick;
        ControlEvent.dataSource = null;
        ControlEvent.NameType = 'Button';

        return ControlEvent;
    }


    export function Dropdown(dataSourc: Array<any>, textField: string, onchange?: () => void, onkeyup?: () => void, onclick?: () => void): ControlEvents {

        ControlEvent = new ControlEvents();

        ControlEvent.onchange = onchange;
        ControlEvent.onkeyup = onkeyup;
        ControlEvent.onclick = onclick;
        ControlEvent.dataSource = dataSourc;
        ControlEvent.NameType = 'Dropdown';
        ControlEvent.textField = textField;

        return ControlEvent;
    }



}

var flagNotClick = false;
var flagBack = false;
var FlagValid = true;


let classs = $('<style> .display_hidden {display:none !important; }  .Text_right {text-align: right; }  .Text_left {text-align: left; } .Search_grid { background-position: 10px 10px;background-repeat: no-repeat;width: 100%;font-size: 16px;padding: 12px 20px 12px 40px;border: 1px solid #ddd;margin-bottom: 12px;} </style>')
$('head:first').append(classs);

function BindGridControl(Grid: ESGrid) {


    let NameTable = Grid.ESG.NameTable;
    let style_Text = '';

    if (Grid.ESG.Right == true) {
        $("#" + NameTable).attr('style', 'direction: rtl;');
        style_Text = 'Text_right';
    }
    else {
        $("#" + NameTable).attr('style', 'direction: ltr;');
        style_Text = 'Text_left';

    }


    $("#" + NameTable).html("");
    let table;  // بناء هيكل الجدوا
    table = '' +


        '<div class="sparkline8-graph" style="border-radius: 50px;">' +
        '<div class="datatable-dashv1-list custom-datatable-overright">' +
        '<div class="button-ap-list responsive-btn">' +
        '<button id="btnEdit_' + NameTable + '" type="button" class="btn btn-custon-four btn-success"><i class="fa fa-save"></i>&nbsp; Edit</button>' +
        '<button id="btnsave_' + NameTable + '" type="button" class="btn btn-custon-four btn-success"><i class="fa fa-save"></i>&nbsp; save</button>' +
        '<button id="btnClean_' + NameTable + '" type="button" class="btn btn-custon-four btn-danger" style="background-color: sandybrown;"><i class="fa fa-refresh"></i>  Back</button>' +
        '</div>' + 
        '<br />' +
        '<div class=" btn-group project-list-action">' +
        '<button id="btnAdd_' + NameTable + '" class="btn btn-custon-four btn-success oo"><i class="fa fa-plus"></i></button>' +
        '</div>' +
        '<div class=" btn-group project-list-action" style="width: 20%;">' +
        '</div>' +
         
        '<div id="DivMassage_' + NameTable +'"  class=" btn-group project-list-action" style="width: 55%;background-color: brown;color: white;font-weight: bold;text-align: center;border-radius: 50px;">' +
        '<h3 id="TextMassage_' + NameTable+'">Message</h3> ' +
        '</div>' +
        '<br />' +
        '<br />' +

        '<div class=" btn-group project-list-action" style="width: 20%;">' +
        '<input type="text" id="Search_' + NameTable + '"  class="Search_grid" placeholder="Search for names.." title="Type in a name">' +
        '</div>' +

        '<table id="table_' + NameTable + '" data-toggle="table"   data-page-number="2" data-page-size="5"   data-pagination="true" data-resizable="true" data-cookie="true" data-cookie-id-table="saveId" data-show-export="false" data-click-to-select="true" data-toolbar="#toolbar">' +
        '<thead id="thead_' + NameTable + '">' +
        '<tr id="tr_' + NameTable + '">' +
        '<th class="' + NameTable + '_Delete" data-field=""></th>' +
        '<th class="' + NameTable + '_Copy" data-field=""></th>' +

        '</tr>' +
        '</thead>' +
        '<tbody id="tbody_' + NameTable + '">' +

        '</tbody>' +
        '</table>' +
        '</div>' +

        '</div>'
    $("#" + NameTable).append(table);



    $('#DivMassage_' + NameTable).addClass('display_hidden');


    $('#btnAdd_' + NameTable).click(function (e) {
        BuildGridControl(true, Grid);

        Grid.ESG.LastCounterAdd = Grid.ESG.LastCounter;

    });

    if (flagBack == false) {

        $('#btnClean_' + NameTable).click(function (e) {
            CleanGridControl(null, Grid);
        });
    }

    $('#btnsave_' + NameTable).click(function (e) {

        if (!ValidationGrid(Grid, Grid.ESG.object)) return;

        AssignGridControl(Grid, Grid.ESG.object);

    });

    $('#btnEdit_' + NameTable).click(function (e) {
        EditGridControl(Grid);
    });

    $('#Search_' + NameTable).keyup(function (e) {
        var input, filter, table, tr, td, i, txtValue;
        input = document.getElementById("Search_" + NameTable);
        filter = input.value.toUpperCase();
        table = document.getElementById("table_" + NameTable);
        tr = table.getElementsByTagName("tr");
        for (i = 0; i < tr.length; i++) {
            debugger
           let tds = tr[i].getElementsByTagName("td");


            for (var u = 0; u < tds.length; u++) {

                td = tr[i].getElementsByTagName("td")[u];
                 
                if (td) {
                    try {
                        debugger

                        td = document.getElementById(td.children[0].id);

                        txtValue =   td.value;
                        if (txtValue.toUpperCase().indexOf(filter) > -1) {
                            //alert(txtValue)
                            tr[i].style.display = "";
                            break
                        } else {
                            tr[i].style.display = "none";
                        }
                    } catch (e) {
                    }

                }

            }
            
        }
    });




    for (let i = 0; i < Grid.Column.length; i++) {


        let visible = "";
        if (Grid.Column[i].visible == false) {
            visible = 'hidden';
        }
        let thead; //بناء عناوين الجدول
        thead = '<th data-field="number" class=" ' + style_Text + '  ' + NameTable + '_' + i + '"   ' + visible + ' id="th_' + i + NameTable + '"  data-editable="false">' + Grid.Column[i].title + '</th>'
        $("#tr_" + NameTable).append(thead);


    }
    //------------------------------------------------------------تنظيم الجريد

    Resizable(NameTable);
    //----------------------------------------------------------------------------------

    $('.' + NameTable + '_Delete').attr('style', 'width: 4% !important;');
    $('.' + NameTable + '_Copy').attr('style', 'width: 4% !important;');


    //---------------------------------------------------------------------------------اضافة هيكل body 

    for (let u = 0; u < Grid.Column.length; u++) {

        //--------------------------------------------اضافة style -----------------------------------
        if (Grid.Column[u].style.trim() != '') {
            Grid.Column[u].style = 'width: 10%';
        };

        if (Grid.Column[u].visible == false) {
            Grid.Column[u].style = ' display:none;';
        };

        let title = $('.' + NameTable + '_' + u + '');
        title.attr('style', '' + Grid.Column[u].style + '  !important;');

        let _Delete = $('.' + NameTable + '_Delete');
        _Delete.attr('style', 'display:none !important;');

        let _Copy = $('.' + NameTable + '_Copy');
        _Copy.attr('style', 'display:none !important;');

        $('#btnClean_' + NameTable).attr('style', 'display:none !important;');


        $('#btnAdd_' + NameTable).attr('style', 'display:none !important;');


        $('#btnsave_' + NameTable).attr('style', 'display:none !important;');


        $('#btnEdit_' + NameTable).attr('style', 'display:none !important;');


        if (Grid.ESG.DeleteRow == false) {
            let _Delete = $('.' + NameTable + '_Delete');
            _Delete.addClass('display_hidden');
        };
        if (Grid.ESG.CopyRow == false) {
            let _Copy = $('.' + NameTable + '_Copy');
            _Copy.addClass('display_hidden');
        };
        if (Grid.ESG.Back == false) {
            $('#btnClean_' + NameTable).addClass('display_hidden');
        };
        if (Grid.ESG.Add == false) {
            $('#btnAdd_' + NameTable).addClass('display_hidden');

        };

        if (Grid.ESG.Edit == false) {
            $('#btnEdit_' + NameTable).addClass('display_hidden');

        }
        else {
            $('#btnEdit_' + NameTable).attr('style', '');

        }

        //------------------------------------------------------------------------------------------









    }

    $('.fixed-table-body').attr('style', 'height: 460px; overflow: scroll;');

}

function DisplayDataGridControl(List: Array<any>, Grid: ESGrid) {



    flagBack = true;

    BindGridControl(Grid);

    let NameTable = Grid.ESG.NameTable;
    $('#btnClean_' + NameTable).click(function (e) {
        CleanGridControl(List, Grid);
    });

    if (List != null) {

        for (let i = 0; i < List.length; i++) {
            BuildGridControl(false, Grid);
            DisplayData(List[i], Grid)
        }
    }

    flagBack = false;



    //let x =`   <link href="https://unpkg.com/bootstrap-table@1.20.2/dist/bootstrap-table.min.css" rel="stylesheet">

    //<script src="https://unpkg.com/bootstrap-table@1.20.2/dist/bootstrap-table.min.js"></script>`

    //$('#main-menu').append(x);
}

function DisplayData(List: any, Grid: ESGrid) {

    let NameTable = Grid.ESG.NameTable;
    let cnt = Grid.ESG.LastCounter - 1;

    let _Delete = $('.' + NameTable + '_Delete');
    _Delete.attr('style', 'display:none !important;');

    let btn_minus = $('#td_btn_minus_' + NameTable + cnt);
    btn_minus.attr('style', 'display:none !important;');


    let _Copy = $('.' + NameTable + '_Copy');
    _Copy.attr('style', 'display:none !important;');

    let btn_Copy = $('#td_btn_Copy_' + NameTable + cnt);
    btn_Copy.attr('style', 'display:none !important;');

    for (let u = 0; u < Grid.Column.length; u++) {


        try {


            var values: Array<any> = Object["values"](List);

            if (Grid.Column[u].ColumnType.NameType == 'Input') {

                $('#' + NameTable + '_' + Grid.Column[u].Name + cnt + '').val(values[u]);
            }

            if (Grid.Column[u].ColumnType.NameType == 'Dropdown') {
                $('#' + NameTable + '_' + Grid.Column[u].Name + cnt + '').val(values[u]);
            }

            if (Grid.Column[u].ColumnType.NameType == 'Button') {
                $('#' + NameTable + '_' + Grid.Column[u].Name + cnt + '').val(values[u]);
            }

            if (Grid.Column[u].ColumnType.NameType == 'checkbox') {
                if (values[u] == 1 || values[u] == true) {

                    $('#' + NameTable + '_' + Grid.Column[u].Name + cnt + '').prop('checked', true)
                }
                else {

                    $('#' + NameTable + '_' + Grid.Column[u].Name + cnt + '').prop('checked', false)
                }
            }

        } catch (e) {

        }


    }

}


function BuildGridControl(flagDisplay: boolean, Grid: ESGrid) {

    let NameTable = Grid.ESG.NameTable;

    let cnt = Grid.ESG.LastCounter;

    if (Grid.ESG.LastCounter == 0) {
        $('#tbody_' + NameTable + '').html('');

    }
    let classDisplay = flagDisplay == false ? "" : "animated zoomIn"
    let tbody = '<tr id= "No_Row_' + NameTable + cnt + '" class="' + classDisplay + '">' +
        '<td id="td_btn_Copy_' + NameTable + cnt + '" class="td_btn_Copy_' + NameTable + '" ><button id="btn_Copy_' + NameTable + cnt + '" type="button" class="btn btn-custon-four btn-danger" style="background-color: cornflowerblue;font-weight: bold;font-size: 22PX;width: 34px;padding: unset;"><i class="fa fa-copy"></i></button></td>' +
        '<td id="td_btn_minus_' + NameTable + cnt + '" class="td_btn_minus_' + NameTable + '" ><button id="btn_minus_' + NameTable + cnt + '" type="button" class="btn btn-custon-four btn-danger" style="font-weight: bold;font-size: 22PX;width: 34px;padding: unset;"><i class="fa fa-minus-circle" ></i></button></td>' +
        '<td id="td_StatusFlag_' + NameTable + '' + cnt + '" style="display:none !important;" ><input  disabled="disabled" id="StatusFlag_' + NameTable + '_' + cnt + '" value="" type="hidden" class="form-control " placeholder="flag" /></td>' +
        '<td id="td_Ser_' + NameTable + '' + cnt + '" style="display:none !important;" ><input  disabled="disabled" id="Ser_' + NameTable + '_' + cnt + '" value="' + cnt + '" type="hidden" class="form-control " placeholder="flag" /></td>' +
        '<td id="Ser_' + NameTable + '' + cnt + '" style="display:none !important;" >' + cnt + '</td>';
    //'<td id="up_' + NameTable + '' + cnt + '"   > <a class="up" href="#">⇑</a></td>'+
    //'<td id="down_' + NameTable + '' + cnt + '"   ><a class="down" href="#">⇓</a></td>';
    '</tr>';
    $('#tbody_' + NameTable + '').append(tbody);



    //$('.up,.down').click(function () {
    //    var row = $(this).parents('tr:first');
    //    if ($(this).is('.up')) { 
    //        row.prev().prev().before(row)
    //    } else {
    //        row.next().next().after(row)
    //    }
    //});


    //var $tbody = $('#tbody_' + NameTable + '');
    //var selected = null;
    //$tbody.children().on("click", function () {
    //    if (selected == null)
    //        selected = this;
    //    else {
    //        $(selected).insertAfter(this);
    //        selected = null;
    //    }
    //});


    if (Grid.ESG.DeleteRow == false) {
        let btn_minus = $('#td_btn_minus_' + NameTable + cnt);
        btn_minus.attr('style', 'display:none !important;');
    };

    if (Grid.ESG.CopyRow == false) {

        let btn_Copy = $('#td_btn_Copy_' + NameTable + cnt);
        btn_Copy.attr('style', 'display:none !important;');
    };



    $('#btn_minus_' + NameTable + cnt).click(function (e) {
        flagNotClick = true;
        DeleteRow('No_Row_' + NameTable + cnt, cnt, NameTable);
    });

    $('#btn_Copy_' + NameTable + cnt).click(function (e) {
        flagNotClick = true;
        CopyRow(Grid, cnt);
    });


    for (let u = 0; u < Grid.Column.length; u++) {



        let td = '';
        let classEdit = '';

        if (Grid.Column[u].Edit == true) {
            classEdit = 'Edit_' + NameTable;
        };






        if (Grid.Column[u].ColumnType.NameType == 'Input') {
            td = '<td id="td_' + NameTable + '_' + Grid.Column[u].Name + cnt + '" ><input  disabled="disabled" id="' + NameTable + '_' + Grid.Column[u].Name + cnt + '" value="' + Grid.Column[u].value + '" type="' + Grid.Column[u].Type + '" class="form-control ' + classEdit + '" placeholder="' + Grid.Column[u].value + '" /></td>';
            $('#No_Row_' + NameTable + cnt + '').append(td);
        }

        if (Grid.Column[u].ColumnType.NameType == 'Dropdown') {
            td = '<td id="td_' + NameTable + '_' + Grid.Column[u].Name + cnt + '" ><select disabled="disabled"  id="' + NameTable + '_' + Grid.Column[u].Name + cnt + '" class="form-control ' + classEdit + '">  </select></td>';
            $('#No_Row_' + NameTable + cnt + '').append(td);
            let ddlFilter: HTMLSelectElement = document.getElementById('' + NameTable + '_' + Grid.Column[u].Name + cnt + '') as HTMLSelectElement;
            DocumentActions.FillCombowithdefult(Grid.Column[u].ColumnType.dataSource, ddlFilter, Grid.Column[u].Name, Grid.Column[u].ColumnType.textField, "Select");
        }

        if (Grid.Column[u].ColumnType.NameType == 'Button') {
            td = '<td id="td_' + NameTable + '_' + Grid.Column[u].Name + cnt + '" style="text-align: center;" ><button id="' + NameTable + '_' + Grid.Column[u].Name + cnt + '" type="' + Grid.Column[u].Type + '" class="btn btn-custon-four btn-success classEdit"> ' + Grid.Column[u].value + ' </button></td>';
            $('#No_Row_' + NameTable + cnt + '').append(td);
        }

        if (Grid.Column[u].ColumnType.NameType == 'checkbox') {
            td = '<td id="td_' + NameTable + '_' + Grid.Column[u].Name + cnt + '" ><input  disabled="disabled" id="' + NameTable + '_' + Grid.Column[u].Name + cnt + '" value="' + Grid.Column[u].value + '" type="checkbox" class="form-control ' + classEdit + '" placeholder="' + Grid.Column[u].value + '" /></td>';
            $('#No_Row_' + NameTable + cnt + '').append(td);
        }





        $('#' + NameTable + '_' + Grid.Column[u].Name + cnt + '').focus(function () {



            Grid.ESG.RowCnt = Number($("#Ser_" + NameTable + '_' + cnt).val())



        });


        $('#' + NameTable + '_' + Grid.Column[u].Name + cnt + '').click(function () {

            if ($("#StatusFlag_" + NameTable + '_' + cnt).val() != "i")
                $("#StatusFlag_" + NameTable + '_' + cnt).val("u");


            Grid.Column[u].ColumnType.onclick();
        });

        $('#' + NameTable + '_' + Grid.Column[u].Name + cnt + '').on('keyup', function (e) {
            if ($("#StatusFlag_" + NameTable + '_' + cnt).val() != "i")
                $("#StatusFlag_" + NameTable + '_' + cnt).val("u");

            Grid.Column[u].ColumnType.onkeyup();
        });

        $('#' + NameTable + '_' + Grid.Column[u].Name + cnt + '').on('change', function (e) {
            if ($("#StatusFlag_" + NameTable + '_' + cnt).val() != "i")
                $("#StatusFlag_" + NameTable + '_' + cnt).val("u");

            Grid.Column[u].ColumnType.onchange();

            ComputeTotalGridControl(Grid, Grid.ESG.object);
        });




        //--------------------------------------------اضافة style -----------------------------------

        if (Grid.ESG.LastCounter == 0) {
            if (Grid.Column[u].style.trim() != '') {
                Grid.Column[u].style = 'width: 10%';
            };

            if (Grid.Column[u].visible == false) {
                Grid.Column[u].style = ' display:none;';
            };

            let title = $('.' + NameTable + '_' + u + '');
            title.attr('style', '' + Grid.Column[u].style + '  !important;');

            let DeleteRow = $('.' + NameTable + '_Delete');
            DeleteRow.attr('style', 'width: 3% !important;');

            let copyRow = $('.' + NameTable + '_Copy');
            copyRow.attr('style', 'width: 3% !important;');

        }



        if (Grid.ESG.DeleteRow == false) {
            let title = $('.' + NameTable + '_Delete');
            title.attr('style', 'display:none !important;');

        };


        if (Grid.ESG.DeleteRow == false) {
            let title = $('.' + NameTable + '_Copy');
            title.attr('style', 'display:none !important;');

        };


        if (Grid.Column[u].visible == false) {
            Grid.Column[u].style = ' display:none;';
            let Column_td = $('#td_' + NameTable + '_' + Grid.Column[u].Name + cnt);
            Column_td.attr('style', '' + Grid.Column[u].style + '  !important;');
        };




        //------------------------------------------------------------------------------------------



    }




    $('#No_Row_' + NameTable + cnt + '').dblclick(function () {

        if (flagNotClick != true) {
            Grid.ESG.SelectedKey = $('#' + NameTable + '_' + Grid.ESG.PrimaryKey + cnt + '').val();
            Grid.ESG.OnRowDoubleClicked();
        }

        flagNotClick = false;

    });


    if ($('#btnsave_' + NameTable).attr('style').trim() == '') {

        $('.Edit_' + NameTable).removeAttr('disabled');

    };

    debugger
    $('#No_Row_' + NameTable + (Grid.ESG.LastCounterAdd - 1) + '').before($('#No_Row_' + NameTable + (cnt) + ''));

    $('#btn_minus_' + NameTable + (cnt) + '').focus();

    debugger
    if (flagDisplay == true) {
        $("#StatusFlag_" + NameTable + '_' + cnt).val('i');
    }

    Grid.ESG.LastCounter++;
    Grid.ESG.LastCounterAdd++;




}

function DeleteRow(ID: string, cnt: number, NameTable: string) {

    WorningMessage("Do you want to delete?", "Do you want to delete?", "warning", "warning", () => {

        $("#" + ID + "").attr("hidden", "true");
        $("#StatusFlag_" + NameTable + '_' + cnt).val() == 'i' ? $("#StatusFlag_" + NameTable + '_' + cnt).val('m') : $("#StatusFlag_" + NameTable + '_' + cnt).val('d');

    });
}

function CleanGridControl(List: Array<any>, Grid: ESGrid) {

    let NameTable = Grid.ESG.NameTable;
    $('#table_' + NameTable).html('');

    $('#btnEdit_' + NameTable).attr('style', '');
    $('#btnsave_' + NameTable).attr('style', 'display:none !important;');
    $('.' + NameTable + '_Delete').attr('style', 'display:none !important;');
    $('#btnClean_' + NameTable).attr('style', 'display:none !important;');
    $('#btnAdd_' + NameTable).attr('style', 'display:none !important;');


    Grid.ESG.LastCounter = 0;
    Grid.ESG.LastCounterAdd = 0;

    DisplayDataGridControl(List, Grid)


    $('[data-toggle="table"]').bootstrapTable();
}

function AssignGridControl(Grid: ESGrid, Newobject: object) {



    var obj = Grid.ESG.object;
    let NameTable = Grid.ESG.NameTable;
    let LastCountGrid = Grid.ESG.LastCounter;


    var DetailsModel = new Array<any>();


    debugger
    let Model = JSON.parse(JSON.stringify(obj));

    for (var i = 0; i < LastCountGrid; i++) {
        debugger
        let cnt = i;
        let StatusFlag = $("#StatusFlag_" + NameTable + '_' + cnt).val();

        Model = JSON.parse(JSON.stringify(obj));

        if (StatusFlag == "i") {

            GActions.AssignToModel(Model, NameTable, cnt, StatusFlag)
            Model.StatusFlag = StatusFlag;
            DetailsModel.push(Model);
        }

        if (StatusFlag == "u") {

            GActions.AssignToModel(Model, NameTable, cnt, StatusFlag)
            Model.StatusFlag = StatusFlag;
            DetailsModel.push(Model);
        }

        if (StatusFlag == "d") {

            GActions.AssignToModel(Model, NameTable, cnt, StatusFlag)
            Model.StatusFlag = StatusFlag;
            DetailsModel.push(Model);
        }


    }

    debugger
    Grid.ESG.Model = DetailsModel;
    Grid.ESG.OnfunctionSave();

    return DetailsModel;

}


function ErrorinputGrid(input: any, NameTable: string, Mess: string) {

    $('#DivMassage_' + NameTable).removeClass('display_hidden');
    $('#TextMassage_' + NameTable).html(Mess); 

    if (input.selector != null) {

        $('' + input.selector + '').addClass('text_Mandatory');
        $('' + input.selector + '').focus();
        setTimeout(function () {
            $('' + input.selector + '').removeClass('text_Mandatory');
            $('#DivMassage_' + NameTable).addClass('display_hidden');

        }, 5000);
    }
    else {
        input.classList.add('text_Mandatory');
        input.focus();
        setTimeout(function () {
            input.classList.remove('text_Mandatory');
            $('#DivMassage_' + NameTable).addClass('display_hidden');

        }, 5000);
    }

}

function ValidationGrid(Grid: ESGrid, Newobject: object) {



    var obj = Grid.Column;
    let NameTable = Grid.ESG.NameTable;
    let LastCountGrid = Grid.ESG.LastCounter;



    obj = obj.filter(x => x.Validation.valid == true);

    FlagValid = true;

    for (var i = 0; i < LastCountGrid; i++) {
        let cnt = i;

        for (var u = 0; u < obj.length; u++) {


            let Model: Column = JSON.parse(JSON.stringify(obj[u]));

            let element = document.getElementById('' + NameTable + '_' + Model.Name + cnt) as HTMLInputElement;

            if (element != null) {

                let con = Model.Validation.conation
                let Con_Value = Model.Validation.Con_Value
                let Mess = Model.Validation.Mess

                if (Model.ColumnType.NameType == 'Input') {

                  

                    if (con[0] == '>') {

                        if (Number(element.value) > Number(Con_Value)) {
                            ErrorinputGrid(element, NameTable,Mess);
                            FlagValid = false;
                            break
                        }

                    }
                    else if (con[0] == '>=') {

                        if (Number(element.value) >= Number(Con_Value)) {
                            ErrorinputGrid(element, NameTable, Mess);
                            FlagValid = false;
                            break
                        }

                    }
                    else if (con[0] == '<=') {

                        if (Number(element.value) <= Number(Con_Value)) {
                            ErrorinputGrid(element, NameTable, Mess);
                            FlagValid = false;
                            break
                        }

                    }
                    else if (con[0] == '<') {

                        if (Number(element.value) < Number(Con_Value)) {
                            ErrorinputGrid(element, NameTable, Mess);
                            FlagValid = false;
                            break
                        }

                    }
                    else if (con[0] == '==') {

                        if (element.value == Con_Value) {
                            ErrorinputGrid(element, NameTable, Mess);
                            FlagValid = false;
                            break
                        }

                    }
                    else if (con[0] == '=') {

                        if (element.value == Con_Value) {
                            ErrorinputGrid(element, NameTable, Mess);
                            FlagValid = false;
                            break
                        }
                    }
                    else {
                        if (Number(element.value) >= 0) {
                            ErrorinputGrid(element, NameTable, Mess);
                            FlagValid = false;
                            break
                        }
                    }

                }
                if (Model.ColumnType.NameType == 'Dropdown') {

                    if (element.value == 'null') {
                        ErrorinputGrid(element, NameTable, 'يبجب ان يكون فيها قيمه');
                        FlagValid = false;
                        break
                    }
                }



            }


        }


        if (FlagValid == false) {
            break;

        }

    }



    return FlagValid;

}

function ComputeTotalGridControl(Grid: ESGrid, Newobject: object) {

    var obj = Grid.ESG.object;
    let NameTable = Grid.ESG.NameTable;
    let LastCountGrid = Grid.ESG.LastCounter;


    let _obj = JSON.parse(JSON.stringify(obj));

    var _keys = Object.keys(_obj).filter(this_fruit => _obj[this_fruit] !== "" && _obj[this_fruit] !== true && _obj[this_fruit] !== false);
    var Model = {};
    _keys.forEach(key => Model[key] = _obj[key]);


    Model["Ser"] = 0;

    for (var i = 0; i < LastCountGrid; i++) {

        let cnt = i;
        let StatusFlag = $("#StatusFlag_" + NameTable + '_' + cnt).val();

        if (StatusFlag != "d" && StatusFlag != "m") {

            GActions.ComputeTotalToModel(Model, NameTable, cnt, StatusFlag)


        }

        Model["Ser"] += 1;
    }


    Grid.ESG.TotalModel = Model;
    Grid.ESG.OnfunctionTotal();

    return Grid.ESG.TotalModel;

}

function EditGridControl(Grid: ESGrid) {


    let NameTable = Grid.ESG.NameTable;

    $('.Edit_' + NameTable).removeAttr('disabled');

    $('#btnsave_' + NameTable).attr('style', '');




    if (Grid.ESG.DeleteRow == true) {
        let btn_minus = $('.td_btn_minus_' + NameTable + '');
        btn_minus.attr('style', ' ');

        let nam = NameTable + '_Delete';
        let title = $('.' + nam + '');
        title.attr('style', ' ');


        let btn_Copy = $('.td_btn_Copy_' + NameTable + '');
        btn_Copy.attr('style', ' ');

        let name = NameTable + '_Copy';
        let titlee = $('.' + name + '');
        titlee.attr('style', ' ');
    };


    $('#btnClean_' + NameTable).attr('style', '');
    $('#btnAdd_' + NameTable).attr('style', '');


    $('#btnEdit_' + NameTable).attr('style', 'display:none !important;');


    Resizable(NameTable);
}



function CopyRow(Grid: ESGrid, index: number) {

    var obj = Grid.ESG.object;
    let NameTable = Grid.ESG.NameTable;
    let LastCountGrid = Grid.ESG.LastCounter;

    let RowCopy = 0;

    for (var i = 0; i < LastCountGrid; i++) {
        debugger
        var CopyModel = JSON.parse(JSON.stringify(obj));

        let cnt = i;
        let StatusFlag = $("#StatusFlag_" + NameTable + '_' + cnt).val();

        if (cnt == index) {

            GActions.AssignToModel(CopyModel, NameTable, cnt, StatusFlag)

            CopyModel.Ser = LastCountGrid;
            CopyModel.StatusFlag = 'i';

            BuildGridControl(true, Grid);
            BuildCopy(Grid, CopyModel, LastCountGrid)

            RowCopy = LastCountGrid;

            //$("#StatusFlag_" + NameTable + '_' + cnt).val('i');

            //Grid.ESG.LastCounter++; 
            Grid.ESG.LastCounterAdd = Grid.ESG.LastCounterAdd - 1;
            break;

        }

    }

    $('#No_Row_' + NameTable + index + '').after($('#No_Row_' + NameTable + RowCopy + ''));

}



function BuildCopy(Grid: ESGrid, List: any, cnt: number) {
    debugger
    let NameTable = Grid.ESG.NameTable;

    let properties = Object.getOwnPropertyNames(List);
    for (var property of properties) {
        let element = document.getElementById('' + NameTable + '_' + property + cnt) as HTMLInputElement;

        if (element != null) {
            if (element.type == "checkbox")
                if (List[property] == 1 || List[property] == true) {

                    element.checked = true
                }
                else {
                    element.checked = false
                }
            else
                element.value = List[property];
        }
    }


    //for (let u = 0; u < List.length; u++) {
    //    debugger

    //    try {





    //        //var values: Array<any> = Object["values"](List);

    //        //if (Grid.Column[u].ColumnType.NameType == 'Input') {

    //        //    $('#' + NameTable + '_' + Grid.Column[u].Name + cnt + '').val(values[u]);
    //        //}

    //        //if (Grid.Column[u].ColumnType.NameType == 'Dropdown') {
    //        //    $('#' + NameTable + '_' + Grid.Column[u].Name + cnt + '').val(values[u]);
    //        //}

    //        //if (Grid.Column[u].ColumnType.NameType == 'Button') {
    //        //    $('#' + NameTable + '_' + Grid.Column[u].Name + cnt + '').val(values[u]);
    //        //}

    //        //if (Grid.Column[u].ColumnType.NameType == 'checkbox') {
    //        //    if (values[u] == 1 || values[u] == true) {

    //        //        $('#' + NameTable + '_' + Grid.Column[u].Name + cnt + '').prop('checked', true)
    //        //    }
    //        //    else {

    //        //        $('#' + NameTable + '_' + Grid.Column[u].Name + cnt + '').prop('checked', false)
    //        //        $('#' + NameTable + '_' + Grid.Column[u].Name + cnt + '').prop('checked', true)
    //        //    }
    //        //}

    //    } catch (e) {

    //    }


    //}

}

var GActions = {




    AssignToModel: <T>(Model: T, NameTable: string, cnt: number, StatusFlag: string): T => {

        let properties = Object.getOwnPropertyNames(Model);
        for (var property of properties) {
            let element = document.getElementById('' + NameTable + '_' + property + cnt) as HTMLInputElement;

            if (element != null) {
                if (element.type == "checkbox")
                    Model[property] = element.checked;
                else
                    Model[property] = element.value;
            }
        }

        return Model;
    },




    ComputeTotalToModel: <T>(Model: T, NameTable: string, cnt: number, StatusFlag: string): T => {

        let properties = Object.getOwnPropertyNames(Model);
        for (var property of properties) {
            let element = document.getElementById('' + NameTable + '_' + property + cnt) as HTMLInputElement;

            if (element != null) {
                if (element.type != "checkbox")
                    try {

                        Model[property] += Number(element.value);

                    } catch (e) {

                    }

            }
        }

        return Model;
    },


};

function pageSize() {

    $('#table_Grad1').bootstrapTable({
        cache: false,
        height: 400,
        striped: true,
        pagination: true,
        pageSize: 5, //specify 5 here
        pageList: [5, 10, 25, 50, 100, 200]//list can be specified here
    });

}

function Resizable(NameTable: string) {  //تنظيم الجريد

    $('.' + NameTable + '_Delete').attr('style', 'width: 1% !important;');
    $('.' + NameTable + '_Copy').attr('style', 'width: 1% !important;');

    $('[data-toggle="table"]').bootstrapTable();

}