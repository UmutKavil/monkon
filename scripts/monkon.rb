class Monkon < Formula
  desc "⚡ Modern XAMPP replacement - PHP, MySQL, Apache in one app for macOS"
  homepage "https://github.com/UmutKavil/monkon"
  url "https://github.com/UmutKavil/monkon/archive/refs/tags/v0.1.0.tar.gz"
  sha256 "TODO_ADD_SHA256_CHECKSUM_HERE"
  license "MIT"

  depends_on "node"
  depends_on "docker"

  def install
    # Install root dependencies
    system "npm", "install", "--production"

    # Install Electron dependencies
    inside "electron" do
      system "npm", "install", "--production"
    end

    # Install monkon CLI
    bin.install_symlink "cli/monkon.js", "monkon"

    # Create directories
    (var/"monkon/www").mkpath
    (var/"monkon/data").mkpath
    (etc/"monkon").mkpath

    # Copy configuration
    cp ".env.example", "#{etc}/monkon/.env"

    # Copy Docker files
    (libexec/"docker").install Dir["docker/*"]
    cp "docker-compose.yml", "#{libexec}/docker-compose.yml"
  end

  def post_install
    puts ""
    puts "✨ monkon #{version} installed successfully!"
    puts ""
    puts "📁 Directories created:"
    puts "  Web Root:  #{var}/monkon/www"
    puts "  Data:      #{var}/monkon/data"
    puts "  Config:    #{etc}/monkon/.env"
    puts ""
    puts "🚀 Get started:"
    puts "  monkon --help           Show all commands"
    puts "  monkon start            Start all services"
    puts "  monkon status           Check service status"
    puts "  monkon logs             View service logs"
    puts ""
    puts "🌐 Access services:"
    puts "  Apache:     http://localhost"
    puts "  PhpMyAdmin: http://localhost:8080"
    puts "  MySQL:      localhost:3306"
    puts ""
    puts "📚 Documentation: https://github.com/UmutKavil/monkon"
    puts ""
  end

  test do
    system "#{bin}/monkon", "--version"
  end
end

