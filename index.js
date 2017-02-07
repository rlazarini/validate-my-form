'use strict';

function init(){
    function _vF(form) {

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
                if (input.value == "") {
                    $addClass(input, 'error');
                } else {
                    $removeClass(input, 'error');
                    validInputs++;
                }
            } else if (input.getAttribute('type') !== 'radio') {
                if (!_vIF(input)) {
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
                var inputFieldset       = (input.parentNode.parentNode.tagName.toLowerCase() === 'li') ? input.parentNode.parentNode.parentNode : input.parentNode.parentNode
                ,   radiosFieldset      = $byAttr('name', input.name, inputFieldset)
                ,   hasChecked          = false
                ,   qtdInputRequired    = 0;

                for(var j = 0, jlgt = radiosFieldset.length; j < jlgt; j++) {
                    if (radiosFieldset[j].checked) {
                        hasChecked = true;
                    }
                    qtdInputRequired += (radiosFieldset[j].getAttribute('required') === 'required') ? 1 : 0;
                }

                if (!hasChecked) {
                    $addClass(inputFieldset, 'error');
                } else {
                    $removeClass(inputFieldset, 'error');
                    validInputs += qtdInputRequired;
                }
            }
        }

        return (validInputs === collectionRequired.length)
    }

    function _vIF(inputSelector) {
        var inputType = inputSelector.getAttribute('type') || inputSelector.type;

        if (inputType === 'text' || inputType === 'password' || inputType === 'textarea') {
            if (inputSelector.getAttribute('data-type') === 'name') {
                return (new RegExp(/^\D+\s+\D+$/)).test(inputSelector.value);
            } else {
                return (inputSelector.value !== '' && inputSelector.value.replace(/ /g, '').length > 0) ? true : false;
            }
        } else if (inputType === 'email') {
            return (new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)).test(inputSelector.value);
        } else if (inputType === 'data') {
            var recreateDate    =  inputSelector.value.split('/')
            ,   data            =  new Date()
            ,   insertDate      =  recreateDate[2] + '/' + recreateDate[1] + '/' + recreateDate[0]
            ,   dataAtual       =  data.getFullYear() + '/' + (data.getMonth()+1) + '/' + data.getDate()
            ,   validateDate    =  (new Date(insertDate) >= new Date(dataAtual));

            ruleRegex = /(^(((0[1-9]|1[0-9]|2[0-8])[\/](0[1-9]|1[012]))|((29|30|31)[\/](0[13578]|1[02]))|((29|30)[\/](0[4,6,9]|11)))[\/](19|[2-9][0-9])\d\d$)|(^29[\/]02[\/](19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)$)/;
            return (new RegExp(ruleRegex).test(inputSelector.value) && validateDate);
        } else if (
                inputType === 'number' ||
                inputType === 'cpf' ||
                inputType === 'telefone' ||
                inputType === 'cep' ||
                inputType === 'mileage' ||
                inputType === 'currency' ||
                inputType === 'plate'
            ) {
            var inputValue  = inputSelector.value
            ,   inputLength = inputValue.length
            ,   maxNumber   = inputSelector.max || 999999999
            ,   minNumber   = inputSelector.min || 0
            ,   ruleRegex   = ''
            ,   isValid     = true;

            if (inputType === 'telefone') {
                ruleRegex = /^\([1-9]{2}\)\s?[0-9]{4,5}\-[0-9]{4}$/;
            } else if (inputType === 'cpf') {
                ruleRegex = /^[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}$/;
                isValid = $CPFValidator(inputValue);
            } else if (inputType === 'cep') {
                ruleRegex = /^[0-9]{5}\-[0-9]{3}$/;
            } else if (inputType === 'mileage') {
                ruleRegex = /^\d{1,3}(\.\d{3})*$/;
            } else if (inputType === 'currency') {
                ruleRegex = /^R\$ \S+/;
            } else if (inputType === 'plate') {
                ruleRegex = /[a-zA-Z]{3}\-[0-9]{4}/g;
            } else {
                ruleRegex = /^\d+$/;
            }

            return ((inputLength >= minNumber && inputLength <= maxNumber) && (new RegExp(ruleRegex)).test(inputValue) && isValid);
        } else {
            return true;
        }
    }

    function _cM(e) {
        var mask            =   ''
        ,   mask1           =   ''
        ,   mask2           =   ''
        ,   input           =   this
        ,   inputValue      =   this.value
        ,   inputType       =   this.getAttribute('type')
        ,   inputTelType    =   this.getAttribute('data-type')
        ,   charType        =   false
        ,   reverseMask     =   false
        ,   currencyMask    =   false
        ,   literalPattern  =   /[0\*]/
        ,   charPattern     =   /[a-zA-Z]/
        ,   numberPattern   =   /[0-9]/
        ,   excludePattern  =   /[^0-9]/g
        ,   currencySymbol  =   'R$ '
        ,   newValue        =   '';
        
        // CPF MASK
        if (inputType === 'cpf') {
            mask = '000.000.000-00';
        }

        // TELEFONE (FIXO/MOVEL) MASK
        else if (inputType === 'telefone') {
            mask = '(00) 00000-0000';
        }

        // CEP MASK
        else if (inputType === 'cep') {
            mask = '00000-000';
        }

        // DATE MASK
        else if (inputType === 'data') {
            mask = '00/00/0000';
        }

        // PLATE MASK
        else if (inputType === 'plate') {
            mask = 'AAA-0000';
            charType = true;
            literalPattern = /[0-A]/;
        }

        // MILEAGE
        else if (inputType === 'mileage') {
            mask = '000.000';
            reverseMask = true;
        }

        // MONEY
        else if (inputType === 'currency') {
            mask = '00.000.000,00';
            reverseMask = true;
            currencyMask = true;
        }

        if (currencyMask === true) {
            inputValue = inputValue.replace(currencySymbol, '');
        }

        if(reverseMask === true) {
            // Inverte a mascara para fazer as verificações
            mask = mask.split("").reverse().join("");

            // Mascara inversa é só pra números, então remove qualquer ZERO no inicio
            // Funciona com conteúdo colado e inserido
            while (inputValue[0] == '0') {
                inputValue = inputValue.substr(1);
            }

            // Limpa, inverte e transforma o INPUT em array
            inputValue = inputValue.replace(excludePattern, '').split("").reverse();
            // Cria array para retorno de campo tratado
            var returnArray = [];

            // vId = Posição do ponteiro no Input
            // mId = Posição do ponteiro na máscara
            // mSeparatorCount = Quantidade de vezes que um caracter especial da máscara aparece
            for (var vId = 0, mId = 0, mSeparatorCount = 0 ; vId < inputValue.length ; vId++) {
                // Ponteiro da máscara é sempre igual ao ponteiro do Input + a quantidade de
                // caracteres especiais já utilizados.
                mId = vId + mSeparatorCount;
                if (mask[mId].match(literalPattern) == null) {
                    // Se é encontrado um caracter especial na máscara, adicionamos o mesmo
                    // ao array de retorno e incrementamos o contador.
                    returnArray.push(mask[mId]);
                    mSeparatorCount++
                }
                // Adicionamos caracter do Input
                returnArray.push(inputValue[vId]);
            }

            // Invertemos o array de retorno, convertemos em string e retornamos como novo valor
            newValue = returnArray.reverse().join("");
        } else if (inputType === 'telefone' && inputValue.length <= mask.length) {
            newValue = inputValue.replace(/\D/g,"");
            newValue = newValue.replace(/^(\d\d)(\d)/g,"($1) $2");
            if (inputValue.length <= mask.length - 1) {
                newValue = newValue.replace(/(\d{4})(\d)/,"$1-$2");
            } else {
                newValue = newValue.replace(/(\d{5})(\d)/,"$1-$2");
            }
        } else if (inputType === 'number') {
            newValue = inputValue.replace(/\D/g,"");
        } else {
            for (var vId = 0, mId = 0 ; mId < mask.length ; ) {
                if (mId >= inputValue.length)
                    break;

                if (mask[mId] == '0' && inputValue[vId].match(numberPattern) == null) {
                  break;
                }

                if (mask[mId] == 'A' && inputValue[vId].match(charPattern) == null && charType) {
                  break;
                }

                while (mask[mId].match(literalPattern) == null) {
                    if (inputValue[vId] == mask[mId])
                       break;

                    newValue += mask[mId++];
                }

                if (vId == mId) {
                    mId++;
                }
                
                newValue += inputValue[vId++];
            }
        }

        if (currencyMask === true) {
            newValue = currencySymbol + newValue;
        }

        input.value = newValue;
    }

    function $CPFValidator(cpf) {
        var  Soma  = 0
        ,    Resto = 0
        ,    cpf   = cpf.replace(/[^0-9]/g,'');

        if (cpf == "00000000000" ||
            cpf == "11111111111" ||
            cpf == "22222222222" ||
            cpf == "33333333333" ||
            cpf == "44444444444" ||
            cpf == "55555555555" ||
            cpf == "66666666666" ||
            cpf == "77777777777" ||
            cpf == "88888888888" ||
            cpf == "99999999999") return false;

        for (i=1; i<=9; i++) Soma = Soma + parseInt(cpf.substring(i-1, i)) * (11 - i);
        Resto = (Soma * 10) % 11;

        if ((Resto == 10) || (Resto == 11))  Resto = 0;
        if (Resto != parseInt(cpf.substring(9, 10)) ) return false;

        Soma = 0;
        for (i = 1; i <= 10; i++) Soma = Soma + parseInt(cpf.substring(i-1, i)) * (12 - i);
        Resto = (Soma * 10) % 11;

        if ((Resto == 10) || (Resto == 11))  Resto = 0;
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

        return found.length == 1 ? found[0] : (found.length == 0 ? false : found);
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
        _validateForm               : _vF,
        _validateInputForm          : _vIF,
        _createMask                 : _cM
    }
}

try {
    module.exports = init();
} catch(err){
    // using like a library
    window.formValidator = init();
}