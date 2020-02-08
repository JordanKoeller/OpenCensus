rm -rf app/build app/*.so app/*.c app/*.cpython*
if [ $# -eq 1 ]
then
	echo "No container"
	cd app
  rm -rf build *.c *.cpythonc *.so
  pip install numpy==1.15.4 cython
  python3 setup.py build_ext --inplace
else
	echo "With container"
	docker run --rm -it -w "/build-pkg" -v "$PWD/app/:/build-pkg" lambci/lambda:build-python3.7 bash -c "rm -rf build *.c *.cpythonc *.so && pip install numpy==1.15.4 cython && python3 setup.py build_ext --inplace"
fi
sam build
# Need to manually copy over .so files (see https://github.com/awslabs/aws-sam-cli/issues/1360)
cp app/*.so .aws-sam/build/CanYouMigrateLambdaFunction/
