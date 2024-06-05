WITH TeamMembershipTypesData AS (
    SELECT N'Team Admin' AS Description
    UNION SELECT N'Regular Team Member'
)

MERGE INTO TeamMembershipTypes AS Target
USING TeamMembershipTypesData AS Source
ON Target.Description = Source.Description
WHEN NOT MATCHED BY TARGET THEN
    INSERT (Description) VALUES (Source.Description)
WHEN NOT MATCHED BY SOURCE THEN
    DELETE
OUTPUT $action, INSERTED.*, DELETED.*;
