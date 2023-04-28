import { LightningElement, api, track, wire } from 'lwc';

export default class CustomLokup extends LightningElement {
    
    @api objName;
    @api cmpName = ''
    @api iconName = '';
    @api filter = '';
    @api searchPlaceholder='Search';
    @api options;
    @api isRequired = false;
    @track selectedName;
    @track records;
    @track isValueSelected;
    @track blurTimeout;
    searchTerm;
    //css

    @track boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus';
    @track inputClass = '';

    connectedCallback(){
        this.records = JSON.parse(JSON.stringify(this.options));
    }

    handleClick() {
        this.searchTerm = '';
        this.inputClass = 'slds-has-focus';
        this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus slds-is-open';
        this.records = this.options;
    }

    onBlur() {
        this.blurTimeout = setTimeout(() =>  {
            this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus';
            this.records = this.options;
        }, 300);
    }

    onSelect(event) {
        let selectedId = event.currentTarget.dataset.id;
        let selectedName = event.currentTarget.dataset.name;
        const valueSelectedEvent = new CustomEvent('lookupselected', {detail:  selectedId });
        this.dispatchEvent(valueSelectedEvent);
        this.isValueSelected = true;
        this.selectedName = selectedName;
        if(this.blurTimeout) {
            clearTimeout(this.blurTimeout);
        }
        this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus';
    }

    handleRemovePill() {
        this.isValueSelected = false;
        this.selectedName = '';
        this.records = this.options;
        const valueSelectedEvent = new CustomEvent('lookupselected', {detail: '' });
        this.dispatchEvent(valueSelectedEvent);
    }

    onChange(event) {
        this.searchTerm = event.target.value;
        if(this.searchTerm){
            this.records = this.options.filter(record => record.label.toLowerCase().includes(this.searchTerm.toLowerCase()));
        }else{
            this.records = this.options;
        }
    }

    handleOuterClick(event) {
        event.stopPropagation();
        event.preventDefault();
    }

    @api
    checkValidity(){
        let valid= true;
        let fieldErrorMsg="Please enter a";
        this.template.querySelectorAll("lightning-input", "lightning-combobox").forEach(item => {
            if(!this.isValueSelected && !this.selectedName){
                item.setCustomValidity(fieldErrorMsg+' '+'value');
                valid=false;
            }
            else{
                item.setCustomValidity("");
            }
            item.reportValidity();
        });
        return valid;
    }
}