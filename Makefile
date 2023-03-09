# make report name=<name> - create a new report with the given name
report:
	hugo new reports/`date +'%Y%m%d-'$(name)`.md

# make resource name=<name> - create a new resource with the given name
resource:
	hugo new resource/`date +'%Y%m%d-'$(name)`.md

run:
	hugo server -b http://local.lowk.me