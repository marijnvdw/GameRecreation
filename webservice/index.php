<?php
//Require functions for actions
require_once "includes/actions.php";


//$data = getReviewTester();
    $data = getReview();


//Set the header & output JSON so the client will know what to expect.
header("Content-Type: application/json");
echo json_encode($data);
exit;