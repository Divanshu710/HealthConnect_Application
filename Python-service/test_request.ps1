$result = Invoke-RestMethod -Uri http://127.0.0.1:8000/patient-assistant -Method POST -ContentType 'application/json' -InFile 'Python-service/test_request.json'
Write-Host "---FULL REPLY---"
Write-Host $result.reply
Write-Host "---ACTION---"
Write-Host $result.action
Write-Host "---BOOKING_DRAFT---"
if ($result.bookingDraft) { $result.bookingDraft | ConvertTo-Json } else { Write-Host "null" }