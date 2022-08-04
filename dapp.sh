set -e

build_start(){
    npm start
}

build_tests(){
    # need to install jset first for reactjs
    # https://www.codementor.io/@rajjeet/add-jest-to-your-typescript-project-with-4-easy-steps-1do5lhfjb1
    # install environment
    # npm install --save-dev jest-environment-jsdom
    npm test
}

build_decookie(){
    npm install && npm run build
}

case "$1" in 
build_start)
  build_start
;;
build_tests)
  build_tests
;;
build_decookie)
  build_decookie
;;
esac