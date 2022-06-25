public class AccountFactory {
    private static final Integer ACCOUNT_COUNT = 22;
    
    private static final List<String> NAMES = new String[]{'Heinrich Technical Instruments', 'Big State Recycling'};
    private static final List<List<String>> NAME_MATRIX = new List<List<String>> 
    { 
        new String[]{'Research', 'Panama', 'Golden', 'Triangle', 'Primary', 'Mohawk', 'Ideal', 'Productivity', 'RF Tech', 'Rockridge'},
        new String[]{'Industries', 'Limited', 'Incorporated', 'Solutions', 'Services', 'Partners, Inc.', 'Inc.', 'Ind.', 'Ltd.', 'Services, Inc.'}
    };

    private static final List<String> BILLING_STATE = new String[]{'CA', 'NV', 'UT', 'AZ', 'CO', 'NM', 'TX'};

    private List<String> accountNames;

    public AccountFactory() {
        initAccountNames();
    }

    
    public List<Account> generate() {
        List<Account> accounts = new List<Account>();
        for (Integer i=0; i<ACCOUNT_COUNT; i++) {
            accounts.add(generateAccount(accountNames[i]));
        }
        return accounts;
    }

    private Account generateAccount(String name) {
        Account account = new Account(Name = name);
        account.BillingState = RandomGenerator.getStringFromList(BILLING_STATE);
        account.Phone = RandomGenerator.getPhoneNumber();
        return account;
    }

    // Generates random account names based on NAME_MATRIX and hard-coded NAMES
    private void initAccountNames() {
        List<String> randomNames = new List<String>();
        for (Integer i=0; i<NAME_MATRIX[0].size(); i++) {
            for (Integer j=0; j<NAME_MATRIX[1].size(); j++) {
                randomNames.add(NAME_MATRIX[0][i] +' '+ NAME_MATRIX[1][j]);
            }
        }
        accountNames = new List<String>();
        accountNames.addAll(NAMES);
        accountNames.addAll(RandomGenerator.shuffleList(randomNames));
    }

    public void deleteGeneratedAccountsAndRelatedRecords() {
        List<Account> accounts = [SELECT Id FROM Account WHERE Name IN :accountNames];
        List<Id> accountIds = new List<Id>();
        for (Account account : accounts) {
            accountIds.add(account.Id);
        }
        delete [SELECT Id FROM Opportunity WHERE Account.Id IN :accountIds];
        delete [SELECT Id FROM Case WHERE Account.Id IN :accountIds];
        delete accounts;
    }
}