/*Ext.onReady(function(){

});
*/
// custom Vtype for vtype:'IPAddress'
Ext.apply(Ext.form.VTypes, {
    IPAddress:  function(v) {
        return /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(v);
    },
    IPAddressText: 'Must be a numeric IP address',
    IPAddressMask: /[\d\.]/i
});

Ext.apply(Ext.form.VTypes, {
    IPv6Address:  function(v) {
        return /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/.test(v);
    },
    IPv6AddressText: 'Must be a numeric IP address',
    IPv6AddressMask: /[\d\.]/i
});

Ext.override(Ext.grid.ColumnModel, {
    destroy : function(){
        for(var i = 0, len = this.config.length; i < len; i++){
            Ext.destroy(this.config[i]);
        }
        this.purgeListeners();
    }
});

function bytesToSize(bytes, precision)
{  
    var kilobyte = 1024;
    var megabyte = kilobyte * 1024;
    var gigabyte = megabyte * 1024;
    var terabyte = gigabyte * 1024;
    
    if (bytes==null){return 0}
    if ((bytes >= 0) && (bytes < kilobyte)) {
        return bytes + ' B';
 
    } else if ((bytes >= kilobyte) && (bytes < megabyte)) {
        return (bytes / kilobyte).toFixed(precision) + ' KB';
 
    } else if ((bytes >= megabyte) && (bytes < gigabyte)) {
        return (bytes / megabyte).toFixed(precision) + ' MB';
 
    } else if ((bytes >= gigabyte) && (bytes < terabyte)) {
        return (bytes / gigabyte).toFixed(precision) + ' GB';
 
    } else if (bytes >= terabyte) {
        return (bytes / terabyte).toFixed(precision) + ' TB';
 
    } else if (bytes!=null){
        return bytes + ' B';
    }
    else{
    	return ''
    }
}
var maskingAjax = new Ext.data.Connection({
    listeners: {
        'beforerequest': {
            fn: function(con, opt){
                Ext.get(document.body).mask('Loading...');
            },
            scope: this
        },
        'requestcomplete': {
            fn: function(con, res, opt){
                Ext.get(document.body).unmask();
            },
            scope: this
        },
        'requestexception': {
            fn: function(con, res, opt){
                Ext.get(document.body).unmask();
            },
            scope: this
        }
    }
});

Ext.ns('Ext.ux.form');

/**
 * Creates new DateTime
 * @constructor
 * @param {Object} config A config object
 */
Ext.ux.form.DateTime = Ext.extend(Ext.form.Field, {
    /**
     * @cfg {Function} dateValidator A custom validation function to be called during date field
     * validation (defaults to null)
     */
     dateValidator:null
    /**
     * @cfg {String/Object} defaultAutoCreate DomHelper element spec
     * Let superclass to create hidden field instead of textbox. Hidden will be submittend to server
     */
    ,defaultAutoCreate:{tag:'input', type:'hidden'}
    /**
     * @cfg {String} dtSeparator Date - Time separator. Used to split date and time (defaults to ' ' (space))
     */
    ,dtSeparator:' '
    /**
     * @cfg {String} hiddenFormat Format of datetime used to store value in hidden field
     * and submitted to server (defaults to 'Y-m-d H:i:s' that is mysql format)
     */
    ,hiddenFormat:'Y-m-d H:i:s'
    /**
     * @cfg {Boolean} otherToNow Set other field to now() if not explicly filled in (defaults to true)
     */
    ,otherToNow:true
    /**
     * @cfg {Boolean} emptyToNow Set field value to now on attempt to set empty value.
     * If it is true then setValue() sets value of field to current date and time (defaults to false)
     */
    /**
     * @cfg {String} timePosition Where the time field should be rendered. 'right' is suitable for forms
     * and 'below' is suitable if the field is used as the grid editor (defaults to 'right')
     */
    ,timePosition:'right' // valid values:'below', 'right'
    /**
     * @cfg {Function} timeValidator A custom validation function to be called during time field
     * validation (defaults to null)
     */
    ,timeValidator:null
    /**
     * @cfg {Number} timeWidth Width of time field in pixels (defaults to 100)
     */
    ,timeWidth:90
    ,buttonWidth: 20
    /**
     * @cfg {String} dateFormat Format of DateField. Can be localized. (defaults to 'm/y/d')
     */
    ,dateFormat:'d.m.y'
    /**
     * @cfg {String} timeFormat Format of TimeField. Can be localized. (defaults to 'g:i A')
     */
    ,timeFormat:'H:i:s'
    /**
     * @cfg {Object} dateConfig Config for DateField constructor.
     */
    /**
     * @cfg {Object} timeConfig Config for TimeField constructor.
     */

    // {{{
    /**
     * @private
     * creates DateField and TimeField and installs the necessary event handlers
     */
    ,initComponent:function() {
        // call parent initComponent
        Ext.ux.form.DateTime.superclass.initComponent.call(this);

        // create DateField
        var dateConfig = Ext.apply({}, {
             id:this.id + '-date'
            ,format:this.dateFormat || Ext.form.DateField.prototype.format
            ,width:this.timeWidth
            ,selectOnFocus:this.selectOnFocus
            ,validator:this.dateValidator
            ,listeners:{
                  blur:{scope:this, fn:this.onBlur}
                 ,focus:{scope:this, fn:this.onFocus}
            }
        }, this.dateConfig);
        this.df = new Ext.form.DateField(dateConfig);
        this.df.ownerCt = this;
        delete(this.dateFormat);

        // create TimeField
        var timeConfig = Ext.apply({}, {
             id:this.id + '-time'
            ,format:this.timeFormat || Ext.form.TimeField.prototype.format
            ,width:this.timeWidth
            ,selectOnFocus:this.selectOnFocus
            ,validator:this.timeValidator
            ,listeners:{
                  blur:{scope:this, fn:this.onBlur}
                 ,focus:{scope:this, fn:this.onFocus}
            }
        }, this.timeConfig);
        this.tf = new Ext.form.TimeField(timeConfig);
        this.tf.ownerCt = this;
        delete(this.timeFormat);
        
        this.bt = new Ext.Button({
        	id:this.id+'-button'
        	,width: this.buttonWidth
        	
        	,text:'...'
        });
        this.bt.ownerCt = this;
        
        this.win = new Ext.Window({
            
            layout:'fit',
            closeAction:'hide',
            applyTo:Ext.get('body'),
            modal: true
            ,title:'Выберите дату'    
            ,closable:true
            ,border:true
            ,height: 330
            //,autoHeight: true
            ,width: 500
            ,padding:1
            ,items:{
                xtype: 'form',
                padding:5,
                layout: 'table',
         	   layoutConfig:{ 
         	       columns: 4,
         	   }, 
               baseCls:'x-plain',
               defaults:{
                   margins:'0 5 0 0',  
                   padding:5,
          	       height:30, 
         	       width:150,

         	   },
                columns: 4,
                items: [
                    {
                        xtype: 'radio',
                        boxLabel: 'Квартал',
                        name:'type',
                        inputValue:'Quarter'
                    },
                    {
                        xtype: 'combo',
                        padding:'5px 5px 5px 5px',
                        xtype: 'combo',
                        name: 'quarter',
                        local:true,
                        displayField:'name',
                        hiddenName:'quarter',
                        ref:'../quarter',
                        valueField:'quarter',
                        typeAhead: true,
                        mode: 'local',
                        forceSelection: true,
                        triggerAction: 'all',
                        editable:false,
                        store:  new Ext.data.ArrayStore({
                            fields: ['name','quarter'],
                            data : [['1 квартал',1], 
                                    ['2 квартал',2],
                                    ['3 квартал',3],
                                    ['4 квартал',4],] 
                        }),
                        listeners:{
                        	'render':function(){
                        		this.setValue('1');
                        	}
                        }

                    },
                    {
                    	xtype: 'combo',
                        padding:'5px',
                        xtype: 'combo',
                        name: 'quarter_year',
                        ref:'../quarter_year',
                        local:true,
                        displayField:'year',
                        hiddenName:'year',
                        valueField:'year',
                        typeAhead: true,
                        mode: 'local',
                        forceSelection: true,
                        triggerAction: 'all',
                        editable:false,
                        store:  new Ext.data.ArrayStore({
                            fields: ['year'],
                            data : [['2010'], 
                                    ['2011'], 
                                    ['2012'],
                                    ['2013'],
                                    ['2014'],] 
                        }),
                        listeners:{
                        	'render':function(){
                        		this.setValue((new Date()).getFullYear());
                        	}
                        }
                        

                    },
                    {
                        xtype: 'label',

                        text: 'года',
                    },
                    {
                        xtype: 'radio',
                        boxLabel: 'Месяц',
                        name:'type',
                        inputValue:'Month'
                        	
                    },
                    {
                    	boxLabel:'Месяц',
                        xtype: 'combo',
                        padding:'5px',
                        name: 'this_month',
                        ref:'../this_month',
                        local:true,
                        displayField:'name',
                        hiddenName:'month',
                        valueField:'month',
                        typeAhead: true,
                        mode: 'local',
                        forceSelection: true,
                        triggerAction: 'all',
                        editable:false,
                        store:  new Ext.data.ArrayStore({
                            fields: ['name','month'],
                            data : [['Январь','1'], 
                                    ['Февраль','2'],
                                    ['Март','3'],
                                    ['Апрель','4'],
                                    ['Май','5'],
                                    ['Июнь','6'],
                                    ['Июль','7'],
                                    ['Август','8'],
                                    ['Сентябрь','9'],
                                    ['Октябрь','10'],
                                    ['Ноябрь','11'],
                                    ['Декабрь','12'],
                                    ] 
                        }),
                        listeners:{
                        	'render':function(){
                        		this.setValue('1');
                        	}
                        }

                    },
                    {
                    	xtype: 'combo',
                        padding:'5px',
                        xtype: 'combo',
                        name: 'month_year',
                        ref:'../month_year',
                        local:true,
                        displayField:'year',
                        hiddenName:'year',
                        valueField:'year',
                        typeAhead: true,
                        mode: 'local',
                        forceSelection: true,
                        triggerAction: 'all',
                        editable:false,
                        store:  new Ext.data.ArrayStore({
                            fields: ['year'],
                            data : [['2010'], 
                                    ['2011'], 
                                    ['2012'],
                                    ['2013'],
                                    ['2014'],] 
                        }),
                        listeners:{
                        	'render':function(){
                        		this.setValue((new Date()).getFullYear());
                        	}
                        }
                        

                    },
                    {
                        xtype: 'label',
                        text: 'года'
                    },
                    {
                        xtype: 'radio',
                        boxLabel: 'День',
                        name:'type',
                        inputValue:'day'
                        
                    },
                    {
                        xtype: 'datefield',
                        name:'day',
                        colspan:3,
                        ref:'../day',
                        //steteful:true,
                        //stateId:'xdatetime-day-state'
                    },
                  
                    {
                        xtype: 'radio',
                        boxLabel: 'Период',
                        name:'type',
                        inputValue:'period',
                        //disabled:true
                        
                    },
                    {
                        xtype: 'datefield',
                        name:'period_start',
                        //steteful:true,
                        //stateId:'xdatetime-day-state',
                        //disabled:true
                    },
                    {
                        xtype: 'datefield',
                        colspan:2,
                        name:'period_end',
                        //steteful:true,
                        //stateId:'xdatetime-day-state',
                        //disabled:true
                     	   
                    },
                    {
                        xtype: 'radio',
                        boxLabel: 'Текущий месяц',
                        colspan:4,
                        name:'type',
                        inputValue:'ThisMonth'
                        
                    },
                    {
                        xtype: 'radio',
                        boxLabel: 'Начало недели',
                        colspan:4,
                        name:'type',
                        inputValue:'ThisWeek'

                     	   
                    },
                    {
                        xtype: 'radio',
                        boxLabel: 'Сейчас',
                        colspan:4,
                        name:'type',
                        inputValue:'Now',
                        checked: true,
                     	   
                     	   
                    },
                 
                    {
                        xtype: 'button',
                        text: 'Выбрать',
                        handler: function(button){
                        	button.findParentByType('window').hide()
                        	
                        }
                    }
                ]
            }
        });
        
        this.win.on('hide', function(){
        	me=this;
        	form = me.win.items.items[0].getForm()
        	selectedtype = form.getValues()['type'];
        	//alert(me.win.this_month);
        	if (selectedtype[0]=='Quarter'){
        		
        		
        		if(me.win.quarter.getValue()==1){
        			quarter=1
        		}else{
        			quarter=(me.win.quarter.getValue()-1)*3
        		}
        		
        		this.setValue(new Date(me.win.quarter_year.getValue(),quarter,1));
        	}
        	if (selectedtype[2]=='day'){
        		
        		this.setValue(me.win.day.getValue());
        	}
        	if (selectedtype[4]=='ThisMonth'){
        		
        		var dt = new Date();
        		
        		//alert(dt.getYear());
        		this.setValue(new Date(dt.getFullYear(),dt.getMonth(),1));
        	}
        	

        	if (selectedtype[5]=='ThisWeek'){
            	var dif, d = new Date(); // Today's date
            	dif = (d.getDay() + 6) % 7; // Number of days to subtract
            	
        		this.setValue(new Date(d - dif * 24*60*60*1000));
        	}
        	if (selectedtype[6]=='Now'){
        		this.setValue(new Date());
        	}
        	if (selectedtype[1]=='Month'){
        		this.setValue(new Date(me.win.month_year.getValue(), me.win.this_month.getValue(), 1));
        	}
        	//new Date('1/10/2007 03:05:01 PM GMT-0600')
            //this.setDateTimeFromWin(getSelectedDate());
        }, this);
        this.bt.on('click', function(obj, ev){
            // create the window on the first click and reuse on subsequent clicks
            
                
            
            //win.render();
            //win.center();
            obj.ownerCt.win.show(obj.ownerCt);
        });
        // relay events
        this.relayEvents(this.df, ['focus', 'specialkey', 'invalid', 'valid']);
        this.relayEvents(this.tf, ['focus', 'specialkey', 'invalid', 'valid']);

        this.on('specialkey', this.onSpecialKey, this);

    } // eo function initComponent
    // }}}
    // {{{
    /**
     * @private
     * Renders underlying DateField and TimeField and provides a workaround for side error icon bug
     */
    ,onRender:function(ct, position) {
        // don't run more than once
        if(this.isRendered) {
            return;
        }

        // render underlying hidden field
        Ext.ux.form.DateTime.superclass.onRender.call(this, ct, position);
        if (this.otherToNow){
        	this.initDateValue();
        }
        // render DateField and TimeField
        // create bounding table
        var t;
        if('below' === this.timePosition || 'bellow' === this.timePosition) {
            t = Ext.DomHelper.append(ct, {tag:'table',style:'border-collapse:collapse',children:[
                 {tag:'tr',children:[{tag:'td', style:'padding-bottom:1px', cls:'ux-datetime-date'}]}
                ,{tag:'tr',children:[{tag:'td', cls:'ux-datetime-time'}]}
            ]}, true);
        }
        else {
            t = Ext.DomHelper.append(ct, {tag:'table',style:'border-collapse:collapse',children:[
                {tag:'tr',children:[
                    {tag:'td',style:'padding-right:4px', cls:'ux-datetime-date'},{tag:'td', cls:'ux-datetime-time'},{tag:'td', cls:'ux-datetime-button'}
                ]}
            ]}, true);
        }

        this.tableEl = t;
        this.wrap = t.wrap({cls:'x-form-field-wrap'});
//        this.wrap = t.wrap();
        this.wrap.on("mousedown", this.onMouseDown, this, {delay:10});

        // render DateField & TimeField
        this.df.render(t.child('td.ux-datetime-date'));
        this.tf.render(t.child('td.ux-datetime-time'));
        this.bt.render(t.child('td.ux-datetime-button'));
        // workaround for IE trigger misalignment bug
        // see http://extjs.com/forum/showthread.php?p=341075#post341075
//        if(Ext.isIE && Ext.isStrict) {
//            t.select('input').applyStyles({top:0});
//        }

        this.df.el.swallowEvent(['keydown', 'keypress']);
        this.tf.el.swallowEvent(['keydown', 'keypress']);
        this.bt.el.swallowEvent(['keydown', 'keypress']);

        // create icon for side invalid errorIcon
        if('side' === this.msgTarget) {
            var elp = this.el.findParent('.x-form-element', 10, true);
            if(elp) {
                this.errorIcon = elp.createChild({cls:'x-form-invalid-icon'});
            }

            var o = {
                 errorIcon:this.errorIcon
                ,msgTarget:'side'
                ,alignErrorIcon:this.alignErrorIcon.createDelegate(this)
            };
            Ext.apply(this.df, o);
            Ext.apply(this.tf, o);
            Ext.apply(this.bt, o);
//            this.df.errorIcon = this.errorIcon;
//            this.tf.errorIcon = this.errorIcon;
        }

        // setup name for submit
        this.el.dom.name = this.hiddenName || this.name || this.id;

        // prevent helper fields from being submitted
        this.df.el.dom.removeAttribute("name");
        this.tf.el.dom.removeAttribute("name");
        this.bt.el.dom.removeAttribute("name");

        // we're rendered flag
        this.isRendered = true;

        // update hidden field
        this.updateHidden();

    } // eo function onRender
    // }}}
    // {{{
    
    ,setDateTimeFromWin:function(value){alert(value)}
    /**
     * @private
     */
    ,adjustSize:Ext.BoxComponent.prototype.adjustSize
    // }}}
    // {{{
    /**
     * @private
     */
    ,alignErrorIcon:function() {
        this.errorIcon.alignTo(this.tableEl, 'tl-tr', [2, 0]);
    }
    // }}}
    // {{{
    /**
     * @private initializes internal dateValue
     */
    ,initDateValue:function() {
        this.dateValue = this.otherToNow ? new Date() : new Date(1970, 0, 1, 0, 0, 0);
    }
    // }}}
    // {{{
    /**
     * Calls clearInvalid on the DateField and TimeField
     */
    ,clearInvalid:function(){
        this.df.clearInvalid();
        this.tf.clearInvalid();
    } // eo function clearInvalid
    // }}}
    // {{{
    /**
     * Calls markInvalid on both DateField and TimeField
     * @param {String} msg Invalid message to display
     */
    ,markInvalid:function(msg){
        this.df.markInvalid(msg);
        this.tf.markInvalid(msg);
    } // eo function markInvalid
    // }}}
    // {{{
    /**
     * @private
     * called from Component::destroy. 
     * Destroys all elements and removes all listeners we've created.
     */
    ,beforeDestroy:function() {
        if(this.isRendered) {
//            this.removeAllListeners();
            this.wrap.removeAllListeners();
            this.wrap.remove();
            this.tableEl.remove();
            this.df.destroy();
            this.tf.destroy();
            this.bt.destroy();
        }
    } // eo function beforeDestroy
    // }}}
    // {{{
    /**
     * Disable this component.
     * @return {Ext.Component} this
     */
    ,disable:function() {
        if(this.isRendered) {
            this.df.disabled = this.disabled;
            this.df.onDisable();
            this.tf.onDisable();
            this.bt.onDisable();
        }
        this.disabled = true;
        this.df.disabled = true;
        this.tf.disabled = true;
        this.bt.disabled = true;
        this.fireEvent("disable", this);
        return this;
    } // eo function disable
    // }}}
    // {{{
    /**
     * Enable this component.
     * @return {Ext.Component} this
     */
    ,enable:function() {
        if(this.rendered){
            this.df.onEnable();
            this.tf.onEnable();
            this.bt.onEnable();
        }
        this.disabled = false;
        this.df.disabled = false;
        this.tf.disabled = false;
        this.bt.disabled = false;
        this.fireEvent("enable", this);
        return this;
    } // eo function enable
    // }}}
    // {{{
    /**
     * @private Focus date filed
     */
    ,focus:function() {
        this.df.focus();
    } // eo function focus
    // }}}
    // {{{
    /**
     * @private
     */
    ,getPositionEl:function() {
        return this.wrap;
    }
    // }}}
    // {{{
    /**
     * @private
     */
    ,getResizeEl:function() {
        return this.wrap;
    }
    // }}}
    // {{{
    /**
     * @return {Date/String} Returns value of this field
     */
    ,getValue:function() {
        // create new instance of date
        return this.dateValue ? new Date(this.dateValue) : '';
    } // eo function getValue
    // }}}
    // {{{
    /**
     * @return {Boolean} true = valid, false = invalid
     * @private Calls isValid methods of underlying DateField and TimeField and returns the result
     */
    ,isValid:function() {
        return this.df.isValid() && this.tf.isValid();
    } // eo function isValid
    // }}}
    // {{{
    /**
     * Returns true if this component is visible
     * @return {boolean} 
     */
    ,isVisible : function(){
        return this.df.rendered && this.df.getActionEl().isVisible();
    } // eo function isVisible
    // }}}
    // {{{
    /** 
     * @private Handles blur event
     */
    ,onBlur:function(f) {
        // called by both DateField and TimeField blur events

        // revert focus to previous field if clicked in between
        if(this.wrapClick) {
            f.focus();
            this.wrapClick = false;
        }

        // update underlying value
        if(f === this.df) {
            this.updateDate();
        }
        else {
            this.updateTime();
        }
        this.updateHidden();

        this.validate();

        // fire events later
        (function() {
            if(!this.df.hasFocus && !this.tf.hasFocus) {
                var v = this.getValue();
                if(String(v) !== String(this.startValue)) {
                    this.fireEvent("change", this, v, this.startValue);
                }
                this.hasFocus = false;
                this.fireEvent('blur', this);
            }
        }).defer(100, this);

    } // eo function onBlur
    // }}}
    // {{{
    /**
     * @private Handles focus event
     */
    ,onFocus:function() {
        if(!this.hasFocus){
            this.hasFocus = true;
            this.startValue = this.getValue();
            this.fireEvent("focus", this);
        }
    }
    // }}}
    // {{{
    /**
     * @private Just to prevent blur event when clicked in the middle of fields
     */
    ,onMouseDown:function(e) {
        if(!this.disabled) {
            this.wrapClick = 'td' === e.target.nodeName.toLowerCase();
        }
    }
    // }}}
    // {{{
    /**
     * @private
     * Handles Tab and Shift-Tab events
     */
    ,onSpecialKey:function(t, e) {
        var key = e.getKey();
        if(key === e.TAB) {
            if(t === this.df && !e.shiftKey) {
                e.stopEvent();
                this.tf.focus();
            }
            if(t === this.tf && e.shiftKey) {
                e.stopEvent();
                this.df.focus();
            }
            this.updateValue();
        }
        // otherwise it misbehaves in editor grid
        if(key === e.ENTER) {
            this.updateValue();
        }

    } // eo function onSpecialKey
    // }}}
    // {{{
    /**
     * Resets the current field value to the originally loaded value 
     * and clears any validation messages. See Ext.form.BasicForm.trackResetOnLoad
     */
    ,reset:function() {
        this.df.setValue(this.originalValue);
        this.tf.setValue(this.originalValue);
    } // eo function reset
    // }}}
    // {{{
    /**
     * @private Sets the value of DateField
     */
    ,setDate:function(date) {
        this.df.setValue(date);
    } // eo function setDate
    // }}}
    // {{{
    /** 
     * @private Sets the value of TimeField
     */
    ,setTime:function(date) {
        this.tf.setValue(date);
    } // eo function setTime
    // }}}
    // {{{
    /**
     * @private
     * Sets correct sizes of underlying DateField and TimeField
     * With workarounds for IE bugs
     */
    ,setSize:function(w, h) {
        if(!w) {
            return;
        }
        if('below' === this.timePosition) {
            this.df.setSize(w, h);
            this.tf.setSize(w, h);
            this.bt.setSize(w, h);
            if(Ext.isIE) {
                this.df.el.up('td').setWidth(w);
                this.tf.el.up('td').setWidth(w);
                this.bt.el.up('td').setWidth(w);
            }
        }
        else {
            this.df.setSize(w - this.timeWidth - 4 - this.buttonWidth, h);
            this.tf.setSize(this.timeWidth, h);
            this.bt.setSize(this.buttonWidth, h);

            if(Ext.isIE) {
                this.df.el.up('td').setWidth(w - this.timeWidth - 4 - this.buttonWidth);
                this.tf.el.up('td').setWidth(this.timeWidth);
                this.bt.el.up('td').setWidth(this.buttonWidth);
            }
        }
    } // eo function setSize
    // }}}
    // {{{
    /**
     * @param {Mixed} val Value to set
     * Sets the value of this field
     */
    ,setValue:function(val) {
        if(!val && true === this.emptyToNow) {
            this.setValue(new Date());
            return;
        }
        else if(!val) {
            this.setDate('');
            this.setTime('');
            this.updateValue();
            return;
        }
        if ('number' === typeof val) {
          val = new Date(val);
        }
        else if('string' === typeof val && this.hiddenFormat) {
            val = Date.parseDate(val, this.hiddenFormat);
        }
        val = val ? val : new Date(1970, 0 ,1, 0, 0, 0);
        var da;
        if(val instanceof Date) {
            this.setDate(val);
            this.setTime(val);
            this.dateValue = new Date(Ext.isIE ? val.getTime() : val);
        }
        else {
            da = val.split(this.dtSeparator);
            this.setDate(da[0]);
            if(da[1]) {
                if(da[2]) {
                    // add am/pm part back to time
                    da[1] += da[2];
                }
                this.setTime(da[1]);
            }
        }
        this.updateValue();
    } // eo function setValue
    // }}}
    // {{{
    /**
     * Hide or show this component by boolean
     * @return {Ext.Component} this
     */
    ,setVisible: function(visible){
        if(visible) {
            this.df.show();
            this.tf.show();
            this.bt.show();
        }else{
            this.df.hide();
            this.tf.hide();
            this.bt.hide();
        }
        return this;
    } // eo function setVisible
    // }}}
    //{{{
    ,show:function() {
        return this.setVisible(true);
    } // eo function show
    //}}}
    //{{{
    ,hide:function() {
        return this.setVisible(false);
    } // eo function hide
    //}}}
    // {{{
    /**
     * @private Updates the date part
     */
    ,updateDate:function() {

        var d = this.df.getValue();
        if(d) {
            if(!(this.dateValue instanceof Date)) {
                this.initDateValue();
                if(!this.tf.getValue()) {
                    this.setTime(this.dateValue);
                }
            }
            this.dateValue.setMonth(0); // because of leap years
            this.dateValue.setFullYear(d.getFullYear());
            this.dateValue.setMonth(d.getMonth(), d.getDate());
//            this.dateValue.setDate(d.getDate());
        }
        else {
            this.dateValue = '';
            this.setTime('');
        }
    } // eo function updateDate
    // }}}
    // {{{
    /**
     * @private
     * Updates the time part
     */
    ,updateTime:function() {
        var t = this.tf.getValue();
        if(t && !(t instanceof Date)) {
            t = Date.parseDate(t, this.tf.format);
        }
        if(t && !this.df.getValue()) {
            this.initDateValue();
            this.setDate(this.dateValue);
        }
        if(this.dateValue instanceof Date) {
            if(t) {
                this.dateValue.setHours(t.getHours());
                this.dateValue.setMinutes(t.getMinutes());
                this.dateValue.setSeconds(t.getSeconds());
            }
            else {
                this.dateValue.setHours(0);
                this.dateValue.setMinutes(0);
                this.dateValue.setSeconds(0);
            }
        }
    } // eo function updateTime
    // }}}
    // {{{
    /**
     * @private Updates the underlying hidden field value
     */
    ,updateHidden:function() {
        if(this.isRendered) {
            var value = this.dateValue instanceof Date ? this.dateValue.format(this.hiddenFormat) : '';
            this.el.dom.value = value;
        }
    }
    // }}}
    // {{{
    /**
     * @private Updates all of Date, Time and Hidden
     */
    ,updateValue:function() {

        this.updateDate();
        this.updateTime();
        this.updateHidden();

        return;
    } // eo function updateValue
    // }}}
    // {{{
    /**
     * @return {Boolean} true = valid, false = invalid
     * calls validate methods of DateField and TimeField
     */
    ,validate:function() {
        return this.df.validate() && this.tf.validate();
    } // eo function validate
    // }}}
    // {{{
    /**
     * Returns renderer suitable to render this field
     * @param {Object} Column model config
     */
    ,renderer: function(field) {
        var format = field.editor.dateFormat || Ext.ux.form.DateTime.prototype.dateFormat;
        format += ' ' + (field.editor.timeFormat || Ext.ux.form.DateTime.prototype.timeFormat);
        var renderer = function(val) {
            var retval = Ext.util.Format.date(val, format);
            return retval;
        };
        return renderer;
    } // eo function renderer
    // }}}

}); // eo extend

// register xtype
Ext.reg('xdatetime', Ext.ux.form.DateTime);

//redefining Ext.lib.Ajax.serializeForm to handle checkboxes more ideally

Ext.lib.Ajax.serializeForm = function(F){
	if(typeof F=="string"){
		F=(document.getElementById(F)||document.forms[F])
	}
	var G,E,H,J,K="",M=false;
	for(var L=0;L<F.elements.length;L++){
		G=F.elements[L];
		J=F.elements[L].disabled;
		E=F.elements[L].name;
		H=F.elements[L].value;
		if(!J&&E){
			switch(G.type){
				case"select-one":
				case"select-multiple":
					for(var I=0;I<G.options.length;I++){
						if(G.options[I].selected){
							if(Ext.isIE){
								K+=encodeURIComponent(E)+"="+encodeURIComponent(G.options[I].attributes["value"].specified?G.options[I].value:G.options[I].text)+"&"
							}else{
								K+=encodeURIComponent(E)+"="+encodeURIComponent(G.options[I].hasAttribute("value")?G.options[I].value:G.options[I].text)+"&"
							}
						}
					}
					break;
				case"radio":
				case"checkbox":
					if(G.checked){
						K+=encodeURIComponent(E)+"="+encodeURIComponent(H)+"&"
					} else {
						K+=encodeURIComponent(E)+"="+encodeURIComponent('0')+"&"
					}
					break;
				case"file":
				case undefined:
				case"reset":
				case"button":
					break;
				case"submit":
					if(M==false){
						K+=encodeURIComponent(E)+"="+encodeURIComponent(H)+"&";M=true
					}
					break;
				default:
					K+=encodeURIComponent(E)+"="+encodeURIComponent(H)+"&";
					break
			}
		}
	}
	K=K.substr(0,K.length-1);
	return K
}

Ext.namespace("Ext.ux");
Ext.ux.comboBoxRenderer = function(combo) {
  return function(value) {
    var idx = combo.store.find(combo.valueField, value);
    var rec = combo.store.getAt(idx);
    return rec.get(combo.displayField);
  };
}

Ext.namespace("Ext.ux.Action");


/**
 * The JSON Submit is a Submit action that send JSON instead of send URL Encoded data... You MUST specify the jsonRoot
 * property...
 * @param form The form to submit
 * @param options The options of the HTTP Request
 */
Ext.ux.Action.JsonSubmit = function(form, options) {
    Ext.ux.Action.JsonSubmit.superclass.constructor.call(this, form, options);
};
 
/**
 * We are extending the default Action Submit...
 */
Ext.extend(Ext.ux.Action.JsonSubmit, Ext.form.Action.Submit, {
    type: 'jsonsubmit',
 
    run : function() {
        var o = this.options;
        var method = this.getMethod();
        var isGet = method == 'GET';
        if (o.clientValidation === false || this.form.isValid()) {
            var encodedParams = Ext.encode(this.form.getValues());
 
            Ext.Ajax.request(Ext.apply(this.createCallback(o), {
                url:this.getUrl(isGet),
                method: method,
                waitMsg: "Please wait while saving",
                waitTitle: "Please wait",
                headers: {'Content-Type': 'application/json'},
                params: String.format('{{0}: {1}}', o.jsonRoot.toLowerCase(), Ext.encode(this.form.getValues())),
                isUpload: this.form.fileUpload
            }));
        } else if (o.clientValidation !== false) { // client validation failed
            this.failureType = Ext.form.Action.CLIENT_INVALID;
            this.form.afterAction(this, false);
        }
    }
});
 
/**
 * We register the new action type...
 */
Ext.apply(Ext.form.Action.ACTION_TYPES, {
    'jsonsubmit' : Ext.ux.Action.JsonSubmit
});

//*****************************************
//ExtJS method for dynamic columns
//*****************************************
Ext.data.DynamicJsonReader = function(config)
{
  Ext.data.DynamicJsonReader.superclass.constructor.call(this, config, []);
};

Ext.extend(Ext.data.DynamicJsonReader, Ext.data.JsonReader, {
  getRecordType: function(data)
  {
      var i = 0, arr = [];
      for (var name in data[0]) { arr[i++] = name; } // is there a built-in to do this?

      this.recordType = Ext.data.Record.create(arr);
      return this.recordType;
  },

  readRecords: function(o)
  { // this is just the same as base class, with call to getRecordType injected
      this.jsonData = o;
      var s = this.meta;
      var sid = s.id;

      var totalRecords = 0;
      if (s.totalProperty)
      {
          var v = parseInt(eval("o." + s.totalProperty), 10);
          if (!isNaN(v))
          {
              totalRecords = v;
          }
      }
      var root = s.root ? eval("o." + s.root) : o;

      var recordType = this.getRecordType(root);
      var fields = recordType.prototype.fields;

      var records = [];
      for (var i = 0; i < root.length; i++)
      {
          var n = root[i];
          var values = {};
          var id = (n[sid] !== undefined && n[sid] !== "" ? n[sid] : null);
          for (var j = 0, jlen = fields.length; j < jlen; j++)
          {
              var f = fields.items[j];
              var map = f.mapping || f.name;
              var v = n[map] !== undefined ? n[map] : f.defaultValue;
              v = f.convert(v);
              values[f.name] = v;
          }
          var record = new recordType(values, id);
          record.json = n;
          records[records.length] = record;
      }
      return {
          records: records,
          totalRecords: totalRecords || records.length,
          totalProperty: 'totalRecords'
      };
  }
});

Ext.grid.DynamicColumnModel = function(store)
{
  var cols = [];
  var recordType = store.recordType;
  var fields = recordType.prototype.fields;

  //for dynamic columns we need to return the columnInfo from server so we can build the columns here.
  //in this example, the ResultData is a JSON object, returned from the server which contains a ColumnInfo
  //object with "fields" collection. Each Field in Fields Collection holds the information column
  //we are using the "renderer" here as well to show one important feature of displaying the MVC JSon Date
  $.each(store.reader.jsonData.ResultData.columnInfo.fields, function(index, metaValue)
  {
      cols[index] = { header: metaValue.header, dataIndex: metaValue.dataIndex, width: metaValue.width,
          sortable: metaValue.sortable, hidden: metaValue.hidden,
          renderer: function(dtData) { if (metaValue.renderer) { return eval(metaValue.renderer + "('" + dtData + "')"); } else return dtData; }
      };
  });

  Ext.grid.DynamicColumnModel.superclass.constructor.call(this, cols);
};
Ext.extend(Ext.grid.DynamicColumnModel, Ext.grid.ColumnModel, {});
//*****************************************
//End of dynamic columns
//*****************************************


