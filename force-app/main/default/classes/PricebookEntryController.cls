/************************************************************************************************
* Name      : PricebookEntryController
* Purpose   : Controller class to PricebookEntry Object
* Author    : Bruna Girão
* Date      : 15/06/2022  
-------------------------------------------------------------------------------------------
15/06/2022           Bruna Girão         create class 
***************************************************************************************************/
public with sharing class PricebookEntryController {
    
    @AuraEnabled
    public static ActionResponse.Response getPricebookEntry(){

        try {
            String pbId = PricebookController.getStandardPricebookId();

            List<PricebookEntryResponse> pbeResponseList = new List<PricebookEntryResponse>();
            for (PricebookEntry pbe : [
                SELECT Id, Name, ProductCode, Pricebook2Id, 
                       Product2Id, UnitPrice, IsActive
                  FROM PricebookEntry
                 WHERE IsActive     = TRUE
                   AND Pricebook2Id =: pbId
            ]) {
                pbeResponseList.add(new PricebookEntryResponse(pbe));
            }

            ActionResponse.Response response = new ActionResponse.Response(
                false, '', JSON.serialize(pbeResponseList)
            );
            return response; 
        } catch (Exception e) {
            return new ActionResponse.Response(e);
        }
    
    }

    public class PricebookEntryResponse {
        @AuraEnabled public String Id              {get; set; }  
        @AuraEnabled public String Name            {get; set; } 
        @AuraEnabled public String Pricebook2Id    {get; set; } 
        @AuraEnabled public String Product2Id      {get; set; } 
        @AuraEnabled public String ProductCode     {get; set; }
        @AuraEnabled public String ProductTitle    {get; set; } 
        @AuraEnabled public Decimal ListPrice      {get; set; } 
        @AuraEnabled public Decimal Quantity       {get; set; } 
        @AuraEnabled public Decimal Discount       {get; set; } 
        @AuraEnabled public Decimal PracticedPrice {get; set; } 
        @AuraEnabled public Decimal SubTotal       {get; set; } 
        @AuraEnabled public Boolean HasAddedToCart {get; set; } 
        @AuraEnabled public Boolean IsActive       {get; set; } 

        public PricebookEntryResponse(){}

        public PricebookEntryResponse(PricebookEntry pbe){
            this.Id             = pbe.Id;
            this.Name           = pbe.Name;
            this.Pricebook2Id   = pbe.Pricebook2Id;
            this.Product2Id     = pbe.Product2Id;
            this.ProductCode    = pbe.ProductCode;
            this.ListPrice      = pbe.UnitPrice;
            this.IsActive       = pbe.IsActive;
            this.Quantity       = 0;
            this.Discount       = 0;
            this.PracticedPrice = 0;
            this.SubTotal       = 0;
            this.HasAddedToCart = false;
            this.ProductTitle   = pbe.Name + ' | ' + pbe.ProductCode;
        }
    }

}
