global without sharing class AccountTriggerHandler implements AfterUpdate, AfterInsert {

    global void handleAfterUpdate(List<Account> oldList, List<Account> newList, Map<Id,sObject> oldMap, Map<Id,sObject> newMap) {
        // Implement my trigger logic
    }

    global void handleAfterInsert(List<Account> newList, Map<Id,sObject> newMap) {
        // Implement my trigger logic
    }
}