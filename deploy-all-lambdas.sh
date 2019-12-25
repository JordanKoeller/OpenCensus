cd lambdas
for d in $(ls -1)
do
	cd $d
	if [ -f setup.py ]
	then
		python3 -m venv venv
		source venv/bin/activate
		pip install -r dev-requirements.txt
		python setup.py build_ext --inplace
		deactivate
	fi
	if [ -f package.json ]
	then
	        npm install
        fi
	serverless deploy
	cd ..
done
