-- Create reviews table for appointment feedback
CREATE TABLE reviews (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    appointment_id BIGINT NOT NULL,
    client_id BIGINT NOT NULL,
    consultant_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment NVARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    
    -- Foreign key constraints
    CONSTRAINT FK_Reviews_Appointment FOREIGN KEY (appointment_id) REFERENCES appointments(id),
    CONSTRAINT FK_Reviews_Client FOREIGN KEY (client_id) REFERENCES users(id),
    CONSTRAINT FK_Reviews_Consultant FOREIGN KEY (consultant_id) REFERENCES users(id),
    
    -- Unique constraint to ensure one review per appointment
    CONSTRAINT UQ_Reviews_Appointment UNIQUE (appointment_id)
);

-- Create index for better performance
CREATE INDEX IX_Reviews_ConsultantId ON reviews(consultant_id);
CREATE INDEX IX_Reviews_ClientId ON reviews(client_id);
CREATE INDEX IX_Reviews_CreatedAt ON reviews(created_at);

-- Insert sample review data
INSERT INTO reviews (appointment_id, client_id, consultant_id, rating, comment, created_at, updated_at)
VALUES 
(1, 1, 2, 5, 'Tư vấn viên rất chuyên nghiệp và tận tâm. Buổi tư vấn rất hữu ích!', GETDATE(), GETDATE()),
(2, 3, 2, 4, 'Tư vấn viên có kiến thức sâu rộng, giải thích rõ ràng.', GETDATE(), GETDATE()),
(3, 1, 4, 5, 'Rất hài lòng với buổi tư vấn. Cảm ơn tư vấn viên!', GETDATE(), GETDATE());

-- Create trigger to update updated_at timestamp
CREATE TRIGGER TR_Reviews_UpdateTimestamp
ON reviews
AFTER UPDATE
AS
BEGIN
    UPDATE reviews 
    SET updated_at = GETDATE()
    FROM reviews r
    INNER JOIN inserted i ON r.id = i.id;
END; 