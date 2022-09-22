resource "aws_dynamodb_table" "children-dynamodb-table" {
  name           = "children-api-dev"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "KidId"
  range_key      = "KidName"

  attribute {
    name = "KidId"
    type = "N"
  }

  attribute {
    name = "KidName"
    type = "S"
  }

  attribute {
    name = "KidSurname"
    type = "S"
  }

  ttl {
    attribute_name = "TimeToExist"
    enabled        = false
  }

  global_secondary_index {
    name               = "KidNameIndex"
    hash_key           = "KidName"
    range_key          = "KidSurname"
    write_capacity     = 5
    read_capacity      = 5
    projection_type    = "INCLUDE"
    non_key_attributes = ["KidId"]
  }

  tags = {
    Name        = "children-api-dev"
    Environment = "dev"
  }
}
