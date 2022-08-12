({
    doInit: function (component, event, helper) {
        
        var accountId = component.get("v.recordId") != undefined ? ((component.get("v.recordId")).substring(0, 3) == '001' ? component.get("v.recordId") : null) : undefined;

            var url = '/lightning/n/NewOrder?';

				url += `c__recordId=${accountId}`;

			var urlEvent = $A.get("e.force:navigateToURL");
			urlEvent.setParams({
				"url": url
			});

			urlEvent.fire();

    }
})