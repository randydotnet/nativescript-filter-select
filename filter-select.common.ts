import { stack } from 'tns-core-modules/ui/frame';
import { AbsoluteLayout } from 'tns-core-modules/ui/layouts/absolute-layout/absolute-layout';
import { Observable } from 'tns-core-modules/data/observable';
import * as app from 'tns-core-modules/application';
import { LayoutBase } from "tns-core-modules/ui/layouts/layout-base";
import { GridLayout } from "tns-core-modules/ui/layouts/grid-layout";
import { StackLayout } from "tns-core-modules/ui/layouts/stack-layout";
import { FlexboxLayout } from "tns-core-modules/ui/layouts/flexbox-layout";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { GridUnitType } from "tns-core-modules/ui/layouts/grid-layout";
import { Label } from "tns-core-modules/ui/label";
import { Button } from "tns-core-modules/ui/button";
import { SearchBar } from "tns-core-modules/ui/search-bar";
import { Repeater } from "tns-core-modules/ui/repeater";
import { ItemSpec } from "tns-core-modules/ui/layouts/grid-layout";
import { ListView } from "tns-core-modules/ui/list-view";
import { Page } from 'tns-core-modules/ui/page';
var frame = require('tns-core-modules/ui/frame');
import { TextView } from "tns-core-modules/ui/text-view";


export class Common extends GridLayout {
  public searchHint = "Search for item";
  public searchBar: SearchBar;
  public xbtn: any = "x";
  private _items: Array<any> = [];
  public selected: Array<any> = [];
  public disabled: any = false
  private _selected_items: Array<any> = this.selected;
  private _selected_layout: any = null;
  private _primary_key: string = "id";
  private _gridBase: any;
  private _search_param: string = 'name';
  private _item_template: any = null;
  private _filterd: ObservableArray<any> = new ObservableArray(this.items);
  private _term: string = '';
  private _lastTerm: string = null;
  public labelselect: any;
  private currentPage = null;
  public render: string = "tags";
  private filterselect: any;
  private _modal_title: string = "Please select items";
  private _hint: string = "Please select some items";
  private _selected_flag: string;
  private multiple: any = true;
  public static changeEvent: string = "change";

  public get selected_flag(): string {
    return this._selected_flag;
  }

  public set selected_flag(value: string) {
    this._selected_flag = value;
  }

  public get search_param(): string {
    return this._search_param;
  }

  public set search_param(value: string) {
    this._search_param = value;
  }

  public get filterd(): ObservableArray<any> {
    return this._filterd;
  }

  public set filterd(value: ObservableArray<any>) {
    this._filterd = value;
  }

  public get term(): string {
    return this._term;
  }

  public set term(value: string) {
    this._term = value;
  }


  public get item_template(): any {
    return this._item_template;
  }

  public set item_template(value: any) {
    this._item_template = value;
  }

  public get gridBase(): any {
    return this._gridBase;
  }

  public set gridBase(value: any) {
    this._gridBase = value;
  }

  public get selected_layout(): any {
    return this._selected_layout;
  }

  public set selected_layout(value: any) {
    this._selected_layout = value;
  }

  private modalPage: Page = new Page();


  public get modal_title(): string {
    return this._modal_title;
  }

  public set modal_title(value: string) {
    this._modal_title = value;
  }

  public get hint(): string {
    return this._hint;
  }

  public set hint(value: string) {
    this._hint = value;
  }


  private closeCallback: any;

  public get selected_items(): Array<any> {
    return this._selected_items;
  }

  public set selected_items(value: Array<any>) {
    this._selected_items = value;
  }

  get items() {
    return this._items;
  }

  get primary_key(): any {
    return this._primary_key;
  }

  set primary_key(value: any) {
    this._primary_key = value;
  }

  set items(value) {
    this._items = value;
  }
  constructor() {
    super();

    var self = this;

    setTimeout(function () {
      self.init();
    }, 1)

  }

  public renderTags() {
    var self = this;
    let flexboxLayout = new FlexboxLayout;
    flexboxLayout.flexWrap = 'wrap';
    flexboxLayout.alignContent = "flex-start";
    flexboxLayout.flexGrow = 1;
    if (this.selected.length)
      this.selected.forEach((item) => {
        var grid = new GridLayout;
        let btn = new Button();
        var textFieldBindingOptions = {
          sourceProperty: "xbtn",
          targetProperty: "text",
          twoWay: true
        };
        btn.bind(textFieldBindingOptions, this);
        btn.text = self.xbtn;
        btn.horizontalAlignment = "left";
        btn.set('toDelete', item[self.primary_key]);
        btn.width = 10;
        let label = new Label();
        let stack = new StackLayout();
        label.text = item[self.search_param];
        label.fontSize = 18;
        label.height = "auto";
        label.padding = 1;
        label.width = "auto";
        label.textWrap = true;
        stack.addChild(label);
        stack.orientation = 'vertical';
        GridLayout.setColumn(stack, 1);
        GridLayout.setColumn(btn, 0);

        grid.addColumn(new ItemSpec(1, "auto"));
        grid.addColumn(new ItemSpec(1, "auto"));

        grid.addChild(stack);
        grid.addChild(btn);
        flexboxLayout.addChild(grid);
        grid.className = "filter-select-tag";
        btn.className = "fa filter-select-tag-delete";
        btn.on(Button.tapEvent, function (args) {
          if (self.disabled == false) {
            self.selected.forEach((item, index) => {
              if (item[self.primary_key] == args.object.get("toDelete"))
                self.selected.splice(index, 1);
            });
            self.clearSelect();
          }
        }, self);

      });
    else {
      let label = new Label();
      label.text = self.hint;
      flexboxLayout.addChild(label);
      label.className = "filter-select-hint";
    }



    this.selected_layout = flexboxLayout;
    return flexboxLayout;

  }

  public init() {
    var self = this;

    if (this.multiple == "false")
      this.multiple = false
    if (this.multiple == "true")
      this.multiple = true

    if (this.disabled == "true")
      this.disabled = true

    if (this.disabled == "false")
      this.disabled = false


    if (this.item_template == null)
      this.item_template =  `<Label text="{{ ${this._search_param} }}" textWrap="true" />`;

    if (self.selected_flag)
      this.selected = this.items.filter((item) => {
        return item[self.selected_flag];
      });

    if (this.render == "tags") {
      this.filterselect = this.renderTagsHolder();
      this.addRow(new ItemSpec(1, "auto"));
      this.addChild(this.filterselect);
      GridLayout.setRow(this.filterselect, 0);
      this.verticalAlignment = "top";

    } else if (this.render == "label") {
      this.multiple = false;
      this.labelselect = this.parseOptions(new Label, { className: "filter-select-label fa hint", text: this.hint });
      var textFieldBindingOptions = {
        sourceProperty: "hint",
        targetProperty: "text",
        twoWay: false
      };
      this.labelselect.bind(textFieldBindingOptions, this);


      if (this.selected.length)
        this.labelDone();
      this.on(Button.tapEvent, (arg) => {
        if (self.disabled == false) {
          self.currentPage = frame.topmost().currentPage;
          self.currentPage.showModal(self.modal(), '', function closeCallback() {
          }, true);
        }
      });
      this.addChild(this.labelselect);

    } else if (this.render == "drop") {
      this.multiple = false;
      this.labelselect = this.parseOptions(new Label, {col:"0", className: "filter-select-label fa hint", text: this.hint });

      var textFieldBindingOptions = {
        sourceProperty: "hint",
        targetProperty: "text",
        twoWay: false
      };
      this.labelselect.bind(textFieldBindingOptions, this);
      if (this.selected.length)
        this.labelDone();
      this.on(Button.tapEvent, (arg) => {
        if (self.disabled == false) {
          self.currentPage = frame.topmost().currentPage;
          self.currentPage.showModal(self.modal(), '', function closeCallback() {
          }, true);
        }
      });

      let dropholder = <GridLayout>this.parseOptions(new GridLayout, {rows:["auto"], columns:["star", "auto"] , className: "filter-select-drop-holder" });

      dropholder.addChild(this.labelselect);
      let nsicon = this.parseOptions(new Label, { col:"1",className: "fa filter-select-icon", text: "\uf0d7" });
      dropholder.addChild(nsicon)
      this.addChild(dropholder);
      dropholder.horizontalAlignment = "center";

    }

  }

  renderTagsHolder() {
    let self = this;
    var button = new Button();
    button.text = 'Select';
    button.className = "btn btn-primary btn-filter-select";
    button.on(Button.tapEvent, function (eventData) {
      if (self.disabled == false) {
        self.currentPage = frame.topmost().currentPage;
        self.currentPage.showModal(self.modal(), '', function closeCallback() {
        }, true);
      }
    }, this);
    let tags = this.renderTags()
    let filterselect = new GridLayout();
    filterselect.addRow(new ItemSpec(1, "star"));
    filterselect.addColumn(new ItemSpec(1, "star"));
    filterselect.addColumn(new ItemSpec(1, "auto"));
    filterselect.addChild(button);
    filterselect.addChild(tags);
    GridLayout.setRow(tags, 0);
    GridLayout.setRow(button, 0);
    GridLayout.setColumn(tags, 0);
    GridLayout.setColumnSpan(tags, 1);
    GridLayout.setColumn(button, 1);
    tags.className = 'filter-select-tags-holder';

    return filterselect;
  }

  public tagsDone() {
    let self = this;
    self.filterselect.removeChild(self.selected_layout);
    var tags = self.renderTags()
    self.filterselect.addChild(tags);
    self.filterselect.className = "filter-select-tags-base";
    GridLayout.setColumn(tags, 0);
    tags.className = 'filter-select-tags-holder';
    this.notify({
      object: self,
      eventName: Observable.propertyChangeEvent,
      propertyName: 'hint',
      value: self.hint
    })
  }
  public labelDone() {
    let self = this;
    if (self.selected.length > 0) {
      this.labelselect.text = self.selected[0][this.search_param];
      this.labelselect.className = "filter-select-label fa selected"
    } else {
      this.labelselect.text = self.hint;
      this.notify({
        object: self,
        eventName: Observable.propertyChangeEvent,
        propertyName: 'hint',
        value: self.hint
      });
    }
  }

  public tagsClear() {
    var self = this;
    self.currentPage = frame.topmost().currentPage;
    self.filterselect.removeChild(self.selected_layout);
    var tags = self.renderTags()
    self.filterselect.addChild(tags);
    self.filterselect.className = "filter-select-tags-base";
    GridLayout.setColumn(tags, 0);
    tags.className = 'filter-select-tags-holder';
  }
  public refresh() {
    if (this.render == "tags")
      this.tagsDone();
    else if (this.render == "label" || this.render == "drop")
      this.labelDone();
  }
  private doneSelect() {
    var self = this;

    self.selected = self.selected_items;
    if (this.render == "tags")
      this.tagsDone();
    else if (this.render == "label" || this.render == "drop")
      this.labelDone();

    if (self.multiple == true)
      self.notify({
        eventName: Common.changeEvent,
        object: self,
        selected: self.selected
      });
    else
      self.notify({
        eventName: Common.changeEvent,
        object: self,
        selected: self.selected[0]
      });

    self.closeCallback();
    setTimeout(function () {
      self.searchBar.text = "";
    }, 500);

  }



  private clearSelect() {
    //after remove tag
    var self = this;
    this.tagsClear();

    if (self.multiple == true)
      self.notify({
        eventName: Common.changeEvent,
        object: self,
        selected: self.selected
      });
    else
      self.notify({
        eventName: Common.changeEvent,
        object: self,
        selected: self.selected[0]
      });
  }
  private modal() {
    var self = this;
    var stackLayout = new StackLayout();
    var gridLayout = new GridLayout();
    var listView = new ListView();
    if (Object.prototype.toString.call(this.items) == '[object Array]')
      this.filterd = new ObservableArray(this.items);
    else
      this.filterd = <any>this.items;
    var listViewBindingOptions = {
      sourceProperty: "filterd",
      targetProperty: "items",
      twoWay: false
    };
    listView.bind(listViewBindingOptions, this);

    this.selected_items = this.selected;
    listView.itemTemplate = this.item_template;
    listView.on(ListView.itemLoadingEvent, function (args: any) {
      var selected = self.selected_items.filter((item) => {
        return item[self.primary_key] == self.filterd.getItem(args.index)[self.primary_key];
      });
      if (selected.length)
        args.view.className = "item filter-select-selected";
      else
        args.view.className = "item"
    });
    listView.on("itemTap", function (args) {
      if (self.multiple == false && args.view.className == "item filter-select-selected")
        return 0;
      if (self.multiple == false)
        self.selected_items = [];
      if (args.view.className != "item filter-select-selected") {
        args.view.className = "item filter-select-selected";
        if (self.selected_flag)
          args.view.bindingContext[self.selected_flag] = true;
      }
      else {
        args.view.className = "item";
        if (self.selected_flag)
          args.view.bindingContext[self.selected_flag] = false;
      }

      var selected = self.selected_items.filter(function (item, index) {
        return args.view.bindingContext[self.primary_key] == item[self.primary_key];
      });
      if (!selected.length)
        self.selected_items.push(args.view.bindingContext);
      else
        self.selected_items = self.selected_items.filter(function (item, index) {
          return args.view.bindingContext[self.primary_key] != item[self.primary_key]
        });

      if (self.multiple == false)
        self.doneSelect();


      listView.refresh();
      return true;
    });

    var label = new Label();
    var donebtn = new Button();
    var closebtn = new Button();
    label.text = this.modal_title;
    label.className = "action-bar-title text-center";
    closebtn.text = 'Close';
    closebtn.className = "action-item text-left";
    closebtn.on("tap", function (args) {
      self.selected_items = [];
      self.closeCallback();
    });
    if (this.multiple == false)
      donebtn.text = 'Clear';
    else
      donebtn.text = 'Done';

    donebtn.className = "action-item text-right";
    gridLayout.addRow(new ItemSpec(1, "auto"));
    gridLayout.addColumn(new ItemSpec(70, "pixel"));
    gridLayout.addColumn(new ItemSpec(1, "star"));
    gridLayout.addColumn(new ItemSpec(70, "pixel"));
    gridLayout.addChild(label);
    gridLayout.addChild(closebtn);

    gridLayout.addChild(donebtn);
    GridLayout.setColumn(closebtn, 0);
    GridLayout.setColumn(label, 1);
    GridLayout.setColumn(donebtn, 2);
    gridLayout.className = "action-bar p-10";
    if (this.multiple == false)
      donebtn.on("tap", function (args) {
        if (self.render == "tags") {
          self.selected_items = [];
          self.doneSelect();
        }
        else {
          self.selected = [];
          self.labelselect.text = self.hint;
          self.labelselect.className = "filter-select-label fa hint"
          self.closeCallback();
        }

      });
    else
      donebtn.on("tap", function (args) {
        if (self.selected.length)
          self.doneSelect();
      });

    stackLayout.addChild(gridLayout);

    this.searchBar = new SearchBar();
    this.searchBar.hint = this.searchHint;
    var searchBindingOptions = {
      sourceProperty: "onSubmit",
      targetProperty: "submit",
      twoWay: true
    };
    this.searchBar.bind(searchBindingOptions, this);
    var searchBindingOptions2 = {
      sourceProperty: "term",
      targetProperty: "text",
      twoWay: true
    };
    this.searchBar.bind(searchBindingOptions2, this);
    stackLayout.addChild(this.searchBar);
    this.searchBar.className = "felter-select-search-bar"
    var hr = new StackLayout();
    hr.className = "hr-light";
    stackLayout.addChild(hr);
    (<any>listView).height = '100%';
    stackLayout.addChild(listView);
    listView.className = "felter-select-list"
    this.modalPage.content = stackLayout;
    this.modalPage.on("showingModally", function (args) {
      self.selected_items = self.selected;
      self.closeCallback = args.closeCallback;
    });
    this.listnToSearch();
    return this.modalPage;
  }



  public onSubmit() {


    var self = this;
    new Promise((resolve, reject) => {
      var result = this.items.filter(function (item) {
        return item[self.search_param].toLowerCase().indexOf(self.term.toLowerCase()) > -1
      });
      resolve(new ObservableArray(result));
    }).then((result) => {
      this.filterd = (<any>result);
      self.notify({
        object: self,
        eventName: Observable.propertyChangeEvent,
        propertyName: 'filterd',
        value: this.filterd
      });
      this.listnToSearch();
    }).catch(() => {
      this.listnToSearch();
    });
  }
  private listnToSearch() {
    setTimeout(() => {
      if (this._lastTerm != this.term) {
        this.onSubmit();
        this._lastTerm = this.term;
      } else {
        this.listnToSearch();
      }
    }, 500)
  }

  private parseOptions(view, options) {

    Object.keys(options).forEach(function (key, index) {
      if (key === "rows")
        options[key].forEach(function (value, index) {
          view.addRow(new ItemSpec(1, (<GridUnitType>value)));
        });
      else if (key === "columns")
        options[key].forEach(function (value, index) {
          view.addColumn(new ItemSpec(1, (<GridUnitType>value)));
        });
      else {
        view[key] = options[key];
      }
    });

    return view;
  }

}



