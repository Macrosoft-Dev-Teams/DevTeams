WITH UsersData AS (
    SELECT N'joe@example.com' AS Email, 'Joe' AS DisplayName
    UNION SELECT N'andy@example.com', 'Andy'
)

MERGE INTO Users AS Target
USING UsersData AS Source
ON Target.Email = Source.Email
WHEN NOT MATCHED BY TARGET THEN
    INSERT (Email, DisplayName) VALUES (Source.Email, Source.DisplayName)
WHEN NOT MATCHED BY SOURCE THEN
    DELETE
OUTPUT $action, INSERTED.*, DELETED.*;
