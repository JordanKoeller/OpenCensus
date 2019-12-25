cd lambdas
for d in $(ls -1)
do
	cd $d
	npm install
	serverless deploy
	cd ..
done
