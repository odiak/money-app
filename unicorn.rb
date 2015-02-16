root_dir = File.absolute_path(File.dirname(__FILE__))
tmp_dir = "#{root_dir}/tmp"

worker_processes 2
working_directory root_dir

timeout 300
listen "#{tmp_dir}/unicorn.sock"
pid "#{tmp_dir}/unicorn.pid"

stderr_path "#{tmp_dir}/unicorn.stderr.log"
stdout_path "#{tmp_dir}/unicorn.stdout.log"
