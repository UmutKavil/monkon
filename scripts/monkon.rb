class Monkon < Formula
  desc "Modern XAMPP replacement for macOS with Docker"
  homepage "https://github.com/UmutKavil/monkon"
  url "https://github.com/UmutKavil/monkon/archive/v#{version}.tar.gz"
  sha256 "placeholder_sha256_hash"
  version "0.1.0"

  depends_on "node"
  depends_on "docker"

  def install
    # Install npm dependencies
    system "npm", "install", "--prefix=.", "--production"

    # Install CLI globally
    bin.install "cli/monkon.js"
    bin.write_exec_script "#{bin}/monkon.js"

    # Create directories
    system "mkdir", "-p", "#{Dir.home}/.monkon"
    system "mkdir", "-p", "#{Dir.home}/monkon/www"
    system "mkdir", "-p", "#{Dir.home}/monkon/data"

    # Copy config file if not exists
    config_file = "#{Dir.home}/.monkon/config"
    unless File.exist?(config_file)
      system "cp", ".env.example", config_file
    end

    # Copy docker files
    system "cp", "-r", "docker", "#{libexec}/docker"
    system "cp", "-r", "docker-compose.yml", "#{libexec}/docker-compose.yml"

    # Create wrapper script
    (bin/"monkon-start").write_text <<~EOS
      #!/bin/bash
      cd #{libexec}
      docker-compose up -d
    EOS
    (bin/"monkon-stop").write_text <<~EOS
      #!/bin/bash
      cd #{libexec}
      docker-compose stop
    EOS
  end

  def post_install
    puts ""
    puts "✅ monkon has been installed!"
    puts ""
    puts "Next steps:"
    puts "  1. Start services: monkon start"
    puts "  2. Open: http://localhost"
    puts "  3. Check status: monkon status"
    puts ""
    puts "Web Root: #{Dir.home}/monkon/www"
    puts "Config: #{Dir.home}/.monkon/config"
    puts ""
  end

  test do
    system "#{bin}/monkon.js", "--version"
  end
end
