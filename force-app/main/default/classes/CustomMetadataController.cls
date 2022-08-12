/************************************************************************************************
* Name      : CustomMetadataController
* Purpose   : Controller class get Custom Metadata
* Author    : Bruna Girão
* Date      : 15/06/2022  
-------------------------------------------------------------------------------------------

15/06/2022           Bruna Girão         create class 
***************************************************************************************************/
public with sharing class CustomMetadataController {
    
    @AuraEnabled
    public static AgogeLWCMetadata__mdt getAgogeLWCMetadata() {
        
         AgogeLWCMetadata__mdt metadata = [
            SELECT Id, DeveloperName, MinimumOrderValue__c
              FROM AgogeLWCMetadata__mdt
             WHERE DeveloperName = 'Default'
             LIMIT 1
         ];

         return metadata;
    }
}
