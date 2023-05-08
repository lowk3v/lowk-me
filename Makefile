# make report name=<name> - create a new report with the given name
report:
	name="`date +'%Y%m%d-'$(name)`";\
	hugo new reports/$$name/index.md
	mkdir -p $$name/img

# make resource name=<name> - create a new resource with the given name
resource:
	hugo new resource/`date +'%Y%m%d-'$(name)`.md

run:
	hugo server -b http://local.lowk.me

# make add-tw name link
add-tw: 
	@([ -z "$(link)" ] || [ -z "$(name)" ]) \
		&& echo "Usage: make add-tw name=<name> link=<link>" && exit 1 ;\
	echo "" ;\
	name=`echo $(name)|sed 's/[^a-zA-Z0-9]/-/g'` ;\
	nameFile="content/tweets/$$name.md" ;\
	tweetId=`echo $(link)|cut -d/ -f6` ;\
	tweetUser=`echo $(link)|cut -d/ -f4` ;\
	contentDate=`date +"%Y-%m-%dT%H:%M:%S%Z00"` ;\
	touch "$$nameFile" ;\
	echo "Adding tweet $(name)" ;\
	echo "---" > "$$nameFile" ;\
	echo 'title: "$(name)"' >> "$$nameFile" ;\
	echo 'author: LowK' >> "$$nameFile" ;\
	echo "date: \"$$contentDate\"" >> "$$nameFile" ;\
	echo "description: \"\"" >> "$$nameFile" ;\
	echo "keywords: [security, creator, tweet, smart contract]" >> "$$nameFile" ;\
	echo "type: \"tweets\"" >> "$$nameFile" ;\
	echo "---" >> "$$nameFile" ;\
	echo "" >> "$$nameFile" ;\
	echo "{{< twitter_simple user=\"$$tweetUser\" id=\"$$tweetId\" >}}" >> "$$nameFile" ;\
	echo "" >> "$$nameFile" ;\
	echo "Tweet added to $$nameFile" 