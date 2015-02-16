root_dir = File.absolute_path(File.dirname(__FILE__))

worker_processes 2
working_directory root_dir

timeout 300
listen "tmp/unicorn.sock"
pid "tmp/unicorn.pid"

stderr_path "tmp/unicorn.stderr.log"
stdout_path "tmp/unicorn.stdout.log"
