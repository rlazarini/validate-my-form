'use strict';

function init(){
    function _vMF(form,obj) {

        var fullList             = $byAttr('required', '', form)
        ,   collectionRequired   = []
        ,   radioCollection      = {}
        ,   validInputs          = 0;
        
        if (fullList.length !== undefined) {
            collectionRequired = collectionRequired.concat(fullList);
        } else if (fullList) {
            collectionRequired.push(fullList);
        }

        for(var i = 0, lgt = collectionRequired.length; i < lgt; i++) {
            var input = collectionRequired[i]
            ,   label = '';
            !!input.id && (label = $byAttr('for', input.id, form));
            if (input.tagName.toLowerCase() === 'select') {
                if (input.value === "") {
                    $addClass(input, 'error');
                } else {
                    $removeClass(input, 'error');
                    validInputs++;
                }
            } else if (input.getAttribute('type') !== 'radio') {
                if (!_vIF(input,obj)) {
                    $removeClass(input, 'error');
                    label && $removeClass(label, 'error');
                    input.className += " error";
                    label && (label.className += " error");
                } else {
                    $removeClass(input, 'error');
                    label && $removeClass(label, 'error');
                    validInputs++;
                }
            } else if (radioCollection[input.name] === undefined) {
                radioCollection[input.name] = [];
                var inputFieldset       = input.parentNode
                ,   radiosFieldset      = $byAttr('name', input.name, form)
                ,   hasChecked          = false
                ,   qtdInputRequired    = 0;

                for(var j = 0, jlgt = radiosFieldset.length; j < jlgt; j++) {
                    if (radiosFieldset[j].checked) {
                        hasChecked = true;
                    }
                    qtdInputRequired += (radiosFieldset[j].getAttribute('required') === 'required') ? 1 : 0;
                }

                if (!hasChecked) {
                    for(var j = 0, jlgt = radiosFieldset.length; j < jlgt; j++) {
                        $addClass(radiosFieldset[j].parentNode, 'error');
                    }
                } else {
                    for(var j = 0, jlgt = radiosFieldset.length; j < jlgt; j++) {
                        $removeClass(radiosFieldset[j].parentNode, 'error');
                    }
                    validInputs += qtdInputRequired;
                }
            }
        }

        return (validInputs === collectionRequired.length)
    }

    function _vIF(inputSelector,obj) {
        var inputDataType   = inputSelector.getAttribute('data-type')     || inputSelector.dataset.type
        ,   inputType       = inputSelector.getAttribute('type')          || inputSelector.type
        ,   monetary        = inputSelector.getAttribute('data-monetary') || inputSelector.dataset.monetary  || 'R$'
        ,   ruleRegex       = ''
        ,   objRegex        = (obj) ? obj[inputDataType] || obj[inputType] : '';

        if (inputType === 'email' || inputDataType === 'email') {
            ruleRegex = (!objRegex) ? /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ : objRegex;
            return (new RegExp(ruleRegex)).test(inputSelector.value);
        } else if (inputType === 'date' || inputDataType === 'date') {
            var insertDate      =  inputSelector.value
            ,   formatDate      =  insertDate.replace('-','/')
            ,   recreateDate    =  formatDate.split('/')
            ,   data            =  new Date()
            ,   dataAtual       =  data.getFullYear() + '/' + (data.getMonth()+1) + '/' + data.getDate()
            ,   format          =  (inputType === 'date') ? 'YYYYMMDD' : inputSelector.getAttribute('data-format') || inputSelector.dataset.format || 'YYYYMMDD'
            ,   gtCurrentDate   =  inputSelector.getAttribute('data-gtCurrentDate') || inputSelector.dataset.gtCurrentDate || false
            ,   validateDate    =  !gtCurrentDate;

            if (format.toUpperCase().replace(/\/|-/g,'') === 'YYYYMMDD') {
                if (gtCurrentDate) {
                    validateDate = (new Date(formatDate) >= new Date(dataAtual));
                }
                ruleRegex = /^([0-9]{4}[-/]?((0[13-9]|1[012])[-/]?(0[1-9]|[12][0-9]|30)|(0[13578]|1[02])[-/]?31|02[-/]?(0[1-9]|1[0-9]|2[0-8]))|([0-9]{2}(([2468][048]|[02468][48])|[13579][26])|([13579][26]|[02468][048]|0[0-9]|1[0-6])00)[-/]?02[-/]?29)$/;
            } else if (format.toUpperCase().replace(/\/|-/g,'') === 'DDMMYYYY') {
                if (gtCurrentDate) {
                    formatDate = recreateDate[2] + '/' + recreateDate[1] + '/' + recreateDate[0];
                    validateDate = (new Date(formatDate) >= new Date(dataAtual));
                }
                ruleRegex = /^(((0[1-9]|[12][0-9]|30)[-/]?(0[13-9]|1[012])|31[-/]?(0[13578]|1[02])|(0[1-9]|1[0-9]|2[0-8])[-/]?02)[-/]?[0-9]{4}|29[-/]?02[-/]?([0-9]{2}(([2468][048]|[02468][48])|[13579][26])|([13579][26]|[02468][048]|0[0-9]|1[0-6])00))$/;
            } else if (format.toUpperCase().replace(/\/|-/g,'') === 'MMDDYYYY') {
                if (gtCurrentDate) {
                    formatDate = recreateDate[2] + '/' + recreateDate[0] + '/' + recreateDate[1];
                    validateDate = (new Date(formatDate) >= new Date(dataAtual));
                }
                ruleRegex = /^(((0[13-9]|1[012])[-/]?(0[1-9]|[12][0-9]|30)|(0[13578]|1[02])[-/]?31|02[-/]?(0[1-9]|1[0-9]|2[0-8]))[-/]?[0-9]{4}|02[-/]?29[-/]?([0-9]{2}(([2468][048]|[02468][48])|[13579][26])|([13579][26]|[02468][048]|0[0-9]|1[0-6])00))$/;
            } else {
                if (gtCurrentDate) {
                    validateDate = (new Date(formatDate) >= new Date(dataAtual));
                }
                ruleRegex = /^\d{4}[-\/][01]\d[-\/][0-3]\d$/;
            }

            return (new RegExp(ruleRegex).test(insertDate) && validateDate);

        } else if (
            inputType     === 'number'   ||
            inputDataType === 'number'   ||
            inputDataType === 'cpf'      ||
            inputDataType === 'phone'    ||
            inputDataType === 'zipcode'  ||
            inputDataType === 'mileage'  ||
            inputDataType === 'currency' ||
            inputDataType === 'plate'    ||
            inputDataType === 'name'
        ) {
            var inputValue  = inputSelector.value
            ,   inputLength = inputValue.length
            ,   maxNumber   = inputSelector.max || 999999999
            ,   minNumber   = inputSelector.min || 0
            ,   isValid     = true;
            
            if (inputDataType === 'phone') {
                ruleRegex = (!objRegex) ? /^\([1-9]{2}\)\s?[0-9]{4,5}\-[0-9]{4}$/ : objRegex;
            } else if (inputDataType === 'cpf') {
                ruleRegex = (!objRegex) ? /^[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}$/ : objRegex;
                isValid = $CPFValidator(inputValue);
            } else if (inputDataType === 'zipcode') {
                ruleRegex = (!objRegex) ? /^[0-9]{5}\-[0-9]{3}$/ : objRegex;
            } else if (inputDataType === 'currency') {
                ruleRegex = (!objRegex) ? '^' + monetary.replace('$','\\$') + ' \\d+([\\.|\\,]{1,}\\d{2,})*$' : objRegex;
            } else if (inputDataType === 'plate') {
                ruleRegex = /[a-zA-Z]{3}\-[0-9]{4}/g;
            } else if (inputDataType === 'name') {
                ruleRegex = (!objRegex) ? /^((\s?[\w+áàãâäéèêëíìîïóòõôöúùûüçÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÇ]+))+$/g : objRegex;
            } else {
                ruleRegex = (!objRegex) ? /^\d+$/ : objRegex;
            }

            return ((inputLength >= minNumber && inputLength <= maxNumber) && (new RegExp(ruleRegex)).test(inputValue) && isValid);
        } else if (inputType === 'checkbox') {
            return inputSelector.checked;
        } else if ((inputType === 'text' || inputType === 'password' || inputType === 'textarea') && !inputDataType) {
            return (!objRegex) ? ((inputSelector.value !== '' && inputSelector.value.replace(/ /g, '').length > 0) ? true : false) : objRegex;
        } else {
            return (!objRegex) ? false : (new RegExp(objRegex)).test(inputSelector.value);
        }
    }

    function $CPFValidator(cpf) {
        var  Soma  = 0
        ,    Resto = 0
        ,    cpf   = cpf.replace(/[^0-9]/g,'');

        if (cpf === "00000000000" ||
            cpf === "11111111111" ||
            cpf === "22222222222" ||
            cpf === "33333333333" ||
            cpf === "44444444444" ||
            cpf === "55555555555" ||
            cpf === "66666666666" ||
            cpf === "77777777777" ||
            cpf === "88888888888" ||
            cpf === "99999999999") return false;

        for (var i=1; i<=9; i++) Soma = Soma + parseInt(cpf.substring(i-1, i)) * (11 - i);
        Resto = (Soma * 10) % 11;

        if ((Resto === 10) || (Resto === 11))  Resto = 0;
        if (Resto != parseInt(cpf.substring(9, 10)) ) return false;

        Soma = 0;
        for (var i = 1; i <= 10; i++) Soma = Soma + parseInt(cpf.substring(i-1, i)) * (12 - i);
        Resto = (Soma * 10) % 11;

        if ((Resto === 10) || (Resto === 11))  Resto = 0;
        if (Resto != parseInt(cpf.substring(10, 11) ) ) return false;
        return true;
    }

    function $byAttr(attr, value, elms){
        elms = elms || document;
        var search = elms.getElementsByTagName('*')
        ,   found = [];

        for (var i = 0, lgt = search.length, cur = search[i]; i < lgt; i++, cur = search[i]) {
            if(!cur.attributes[attr]) continue;
            if(!!value && cur.attributes[attr].value != value) continue;
            found.push(cur);
        }

        return found.length === 1 ? found[0] : (found.length === 0 ? false : found);
    }

    function $addClass(elms, c){
        elms = Array.isArray(elms) || $isNodeList(elms) ? elms : [elms];
        c = c.split(' ');
        for(var i = 0, lgt = elms.length; i < lgt; i++){
            var limit = c.length;
            while(limit--){elms[i].classList.add(c[limit])};
        }
    }

    function $removeClass(elms, c){
        elms = Array.isArray(elms) || $isNodeList(elms) ? elms : [elms];
        c = c.split(' ');
        for(var i = 0, lgt = elms.length; i < lgt; i++){
            var limit = c.length;
            while(limit--){elms[i].classList.remove(c[limit])};
        }
    }

    function $isNodeList(nodes) {
        var stringRepr = Object.prototype.toString.call(nodes);

        return typeof nodes === 'object' &&
            /^\[object (HTMLCollection|NodeList|Object)\]$/.test(stringRepr) &&
            (typeof nodes.length === 'number') &&
            (nodes.length === 0 || (typeof nodes[0] === "object" && nodes[0].nodeType > 0));
    }

    return {
        _validateMyForm      : _vMF,
        _validateInputForm   : _vIF
    }
}

try {
    module.exports = init();
} catch(err){
    // using like a library
    window.validateMyForm = init();
}