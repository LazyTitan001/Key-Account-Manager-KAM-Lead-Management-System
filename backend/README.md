# API Endpoints Documentation

## Leads

### Create a New Lead
- **Method:** POST
- **URL:** `http://localhost:3000/api/leads`
- **Body (JSON):**
    ```json
    {
        "restaurant_name": "Example Restaurant",
        "address": "123 Main St",
        "contact_number": "123-456-7890",
        "status": "New",
        "assigned_kam": "John Doe"
    }
    ```

### Get All Leads
- **Method:** GET
- **URL:** `http://localhost:3000/api/leads`

### Get Lead by ID
- **Method:** GET
- **URL:** `http://localhost:3000/api/leads/:id`
- **Params:**
    - `id`: Lead ID

### Update Lead
- **Method:** PUT
- **URL:** `http://localhost:3000/api/leads/:id`
- **Params:**
    - `id`: Lead ID
- **Body (JSON):**
    ```json
    {
        "restaurant_name": "Updated Restaurant",
        "address": "456 Main St",
        "contact_number": "987-654-3210",
        "status": "Active",
        "assigned_kam": "Jane Doe"
    }
    ```

### Search Leads
- **Method:** GET
- **URL:** `http://localhost:3000/api/leads/search/:query`
- **Params:**
    - `query`: Search query

## Contacts

### Create a New Contact
- **Method:** POST
- **URL:** `http://localhost:3000/api/contacts`
- **Body (JSON):**
    ```json
    {
        "lead_id": 1,
        "name": "John Smith",
        "role": "Manager",
        "phone_number": "123-456-7890",
        "email": "john.smith@example.com"
    }
    ```

### Get Contacts for a Lead
- **Method:** GET
- **URL:** `http://localhost:3000/api/contacts/lead/:leadId`
- **Params:**
    - `leadId`: Lead ID

### Update Contact
- **Method:** PUT
- **URL:** `http://localhost:3000/api/contacts/:id`
- **Params:**
    - `id`: Contact ID
- **Body (JSON):**
    ```json
    {
        "lead_id": 1,
        "name": "Jane Smith",
        "role": "Assistant Manager",
        "phone_number": "987-654-3210",
        "email": "jane.smith@example.com"
    }
    ```

## Interactions

### Create a New Interaction
- **Method:** POST
- **URL:** `http://localhost:3000/api/interactions`
- **Body (JSON):**
    ```json
    {
        "lead_id": 1,
        "interaction_date": "2023-10-01",
        "interaction_type": "Call",
        "notes": "Discussed project details",
        "follow_up_required": true
    }
    ```

### Get Interactions for a Lead
- **Method:** GET
- **URL:** `http://localhost:3000/api/interactions/lead/:leadId`
- **Params:**
    - `leadId`: Lead ID

### Get Today's Pending Calls
- **Method:** GET
- **URL:** `http://localhost:3000/api/interactions/pending-calls`
