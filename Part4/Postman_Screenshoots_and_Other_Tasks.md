Step 1: Create a Pet (image.png) and Missing Required Fields (image2.png)
Step 2: Retrieve the Pet (image3.png) and Missing Required Fields(image4.png)
Step 3: Update the Pet (image5.png) and Missing Required Fields (image6.png)
Step 4: Find Pets by Status (image7.png) and Missing Required Fields (image8.png)
Step 5: Delete the Pet (image9.png) and If we tried to delete once again(image10.png)


Negative Scenarios:
Negative Test 1 — Invalid ID format (non-numeric)
Test Objective: Verify system behavior when a non-numeric value is passed as the pet ID.

Request:
Method: GET

URL: {{baseUrl}}/pet/abc

Expected Result (per Swagger docs): 400 Invalid ID supplied

Actual Result: 404 Not Found

==================================================================================================================

Negative Test 2 — Non-existent pet ID
Test Objective: Verify system behavior when requesting a pet ID that does not exist in the store.

Request:
Method: GET

URL: {{baseUrl}}/pet/999999999999

Expected Result (per Swagger docs): 404 Pet not found

Actual Result: 404 Not Found.
Matches the documented behavior correctly.

==================================================================================================================

Negative Test 3 — Invalid status value in Find by Status
Test Objective: Verify system behavior when an invalid status value is passed to the findByStatus endpoint.

Request:

Method: GET

URL: {{baseUrl}}/pet/findByStatus?status=unknownStatus

Expected Result (per Swagger docs): 400 Invalid status value

Actual Result: 200 OK, response body: [] (empty array)
The server does not validate the status enum and silently returns an empty array instead of rejecting the invalid value with a 400 error.

==================================================================================================================

Negative Test 4 — Create pet with missing required fields
Test Objective: Verify system behavior when required fields (name, photoUrls) are missing from the pet creation payload.

Request:

Method: POST

URL: {{baseUrl}}/pet

Body:
{
  "id": 987654322,
  "category": { "id": 1, "name": "Dogs" },
  "status": "available"
}
Expected Result (per Swagger docs): 405 Invalid input

Actual Result: 200 OK — the pet is created successfully even though name and photoUrls are missing from the request body.
The API does not enforce the "required" constraint defined in its own schema.

==================================================================================================================

In terms of this test session, it is presumed that the public Swagger Petstore demo server (https://petstore.swagger.io/v2) acts as a mock/sandbox service and not as an entirely validated production API due to the fact that this is a demo environment with shared/resets data among all users. Generally, the CRUD functions (create, read, update, delete) worked as expected and conformed to the successfully working paths defined in documentation and return status codes. Nevertheless, there were some discrepancies between the Swagger API documentation and the actual server operation, particularly in terms of input validation. In case one tries to create a new pet without necessary fields (such as name and photoUrls), the API will not return an appropriate 405 response code but will return 200 OK instead. Moreover, when an incorrect status is entered into the findByStatus endpoint, the API returns an empty array as a response, while according to documentation, it should have returned 400 Invalid status value. Sending an invalid, non-numeric pet ID will also result in a 404 status code along with the message of a Java internal exception called NumberFormatException being displayed in the body of the response – whereas the expected response code and message are 400 status code and message 'Invalid ID supplied' as described in the documentation – a point worth raising with the development team as it is a possible security issue. From these observations, we can deduce that although the happy-path behavior is fine, the negative-path/input-validation aspect of the API is somewhat inconsistent with the API’s Swagger documentation.











