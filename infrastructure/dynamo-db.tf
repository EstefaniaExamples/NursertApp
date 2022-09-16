resource "aws_dynamodb_table" "children-dynamodb-table" {
  name           = "NurseryChildren"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "Id"
  range_key      = "Name"

  attribute {
    name = "Id"
    type = "HASH"
  }
  attribute {
    name = "Name"
    type = "N"
  }

  attribute {
    name = "BirthdayDate"
    type = "S"
  }

  global_secondary_index {
    name               = "BirthdayDateIndex"
    hash_key           = "BirthdayDate"
    range_key          = "Name"
    write_capacity     = 5
    read_capacity      = 5
    projection_type    = "INCLUDE"
    non_key_attributes = ["Id"]
  }

  tags = {
    Name        = "children-table"
    Environment = "dev"
    Terraform   = true
  }
}