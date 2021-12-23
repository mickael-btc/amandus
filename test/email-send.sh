#!/bin/bash

curl -H "Content-Type: application/json" -X POST http://localhost:12080/send -d\
'{"from":"sender@amandus.fr","to":"some.user@example.com","subject":"hello","text":"hello world!","headers":{"x-sending-zone":"direct"}}'
# x-sending-zone: direct, default or bounce
# email in nodemailer format

