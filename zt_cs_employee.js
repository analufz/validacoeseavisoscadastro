/**
 * @NApiVersion  2.0
 * @NScriptType  ClientScript
 * @NModuleScope SameAccount
 * 
 * Autor: Ana Luiza Fiuza
 */
define([],

function() {
   
   /**
    * Function to be executed after page is initialized.
    * @param {Object} scriptContext
    * @param {Record} scriptContext.currentRecord - Current form record
    * @param {string} scriptContext.mode          - The mode in which the record is being accessed (create, copy, or edit)
    * @since 2015.2
    */
   function pageInit(context) {
        var employee = context.currentRecord;
        var perfRevCount = employee.getLineCount({
            sublistId : 'recmachcustrecord_zt_perf_subordinate'
        });

        var notes = 'Esse funcionário tem ' +perfRevCount + ' Performance(s) Review(s). \n';
        var fRatingCount = 0;
        for (var i = 0; i < perfRevCount; i++) {
            var ratingCode = employee.getSublistValue({
                sublistId : 'recmachcustrecord_zt_perf_subordinate',
                fieldId   : 'custrecord_zt_perf_ratingcode',
                line      : i
            });
            if(ratingCode == 'F' ) {
                fRatingCount += 1;
            }
        }
        notes += 'Esse funcionário tem ' +fRatingCount+ ' review(s) avaliada(s) com F';
        alert(notes);
   }

   /**
    * Function to be executed when field is changed.
    * @param {Object} scriptContext
    * @param {Record} scriptContext.currentRecord - Current form record
    * @param {string} scriptContext.sublistId     - Sublist name
    * @param {string} scriptContext.fieldId       - Field name
    * @param {number} scriptContext.lineNum       - Line number. Will be undefined if not a sublist or matrix field
    * @param {number} scriptContext.columnNum     - Line number. Will be undefined if not a matrix field
    * @since 2015.2
    */
   function fieldChanged(context) {
        var employee = context.currentRecord;
        if(context.fieldId == 'phone') {
            var mobilephone = employee.getValue('mobilephone');
            if(!mobilephone) {
                var phone = employee.getValue('phone');
                employee.setValue('mobilephone', phone);
            }
        }
   }

   /**
    * Function to be executed after line is selected.
    * @param {Object} scriptContext
    * @param {Record} scriptContext.currentRecord - Current form record
    * @param {string} scriptContext.sublistId     - Sublist name
    * @since 2015.2
    */
   function lineInit(context) {
        var employee = context.currentRecord;
        if (context.sublistId == 'recmachcustrecord_zt_perf_subordinate') {
            var reviewType = employee.getCurrentSublistValue({
                sublistId : 'recmachcustrecord_zt_perf_subordinate',
                fieldId   : 'custrecord_zt_perf_reviewtype'
            });
            if(!reviewType) {
                employee.setCurrentSublistValue({
                    sublistId : 'recmachcustrecord_zt_perf_subordinate',
                    fieldId   : 'custrecord_zt_perf_reviewtype',
                    value     : 1                    
                });
            }
        }
   }

   /**
    * Validation function to be executed when field is changed.
    * @param {Object} scriptContext
    * @param {Record} scriptContext.currentRecord - Current form record
    * @param {string} scriptContext.sublistId     - Sublist name
    * @param {string} scriptContext.fieldId       - Field name
    * @param {number} scriptContext.lineNum       - Line number. Will be undefined if not a sublist or matrix field
    * @param {number} scriptContext.columnNum     - Line number. Will be undefined if not a matrix field
    * @returns {boolean} Return true if field is valid
    * @since 2015.2
    */
   function validateField(context) {
        var employee = context.currentRecord;
        if (context.fieldId == 'custentity_zt_cod_funcionario') {
            var employeeCode = employee.getValue('custentity_zt_cod_funcionario');
            if(employeeCode == 'x') {
                alert('Código do funcionário inválido.');
                return false;
           }
        }
        return true;
   }

   /**
    * Validation function to be executed when sublist line is committed.
    * @param {Object} scriptContext
    * @param {Record} scriptContext.currentRecord - Current form record
    * @param {string} scriptContext.sublistId     - Sublist name
    * @returns {boolean} Return true if sublist line is valid
    * @since 2015.2
    */

   function validateLine(context) {
        var employee = context.currentRecord;
        if(context.sublistId == 'recmachcustrecord_zt_perf_subordinate') {
            var increaseAmount = employee.getCurrentSublistValue({
                sublistId : 'recmachcustrecord_zt_perf_subordinate',
                fieldId   : 'custrecord_zt_perf_sal_amt'                
            });
            
            if(increaseAmount > 5000) {
                alert('Aumento de salário não pode ser maior que R$5.000');
                return false;
            }
        }
        return true;
   }

   /**
    * Validation function to be executed when record is saved.
    * @param   {Object} scriptContext
    * @param   {Record} scriptContext.currentRecord - Current form record
    * @returns {boolean}                          - Return true if record is valid
    * @since 2015.2
    */
   function saveRecord(context) {
       var employee = context.currentRecord;
       var employeeCode = employee.getValue('custentity_zt_cod_funcionario');
       if(employeeCode == 'x') {
            alert('Código do funcionário inválido.');
            return false;
       }
       return true;
   };

   return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
            lineInit: lineInit,
            validateField: validateField,
            validateLine: validateLine,
            saveRecord: saveRecord
   };
});