# Contributing to monkon

Thank you for your interest in contributing to monkon! We welcome contributions from everyone.

## Code of Conduct

Please be respectful and constructive in all interactions.

## How to Contribute

### 1. Fork & Clone

```bash
git clone https://github.com/yourusername/monkon.git
cd monkon
```

### 2. Create a Feature Branch

```bash
git checkout -b feature/my-feature
```

### 3. Make Your Changes

- Keep commits atomic and focused
- Write clear commit messages
- Follow the existing code style

### 4. Test Your Changes

```bash
# Test CLI
npm start

# Test Docker setup
docker-compose up -d

# Test Electron GUI
npm run dev:electron

# Check Docker logs
monkon logs
```

### 5. Push & Create PR

```bash
git push origin feature/my-feature
```

Then create a Pull Request on GitHub with a clear description of your changes.

## Development Setup

### Requirements
- Node.js 16+
- Docker Desktop
- macOS 10.15+

### Quick Start

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Create directories
mkdir -p ~/monkon/www
mkdir -p ~/.monkon

# Start Docker services
docker-compose up -d

# Test CLI
node cli/monkon.js status
```

## Project Structure

```
monkon/
├── cli/              # Command-line interface
├── electron/         # Electron GUI application
├── docker/           # Docker configurations
├── scripts/          # Installation & build scripts
└── docs/             # Documentation
```

## Coding Standards

- Use ES6+ modules
- Format code with consistent indentation (2 spaces)
- Use meaningful variable names
- Add comments for complex logic
- Keep functions focused and small

## Testing

When submitting a PR:
- ✅ All CLI commands work
- ✅ Docker services start correctly
- ✅ No console errors or warnings
- ✅ Code follows project style

## Documentation

If you add a new feature, please update:
- `README.md` if it's user-facing
- Code comments for complex logic
- Documentation in `/docs` if applicable

## Release Process

Maintainers will:
1. Review and merge approved PRs
2. Update version in `package.json`
3. Create GitHub release with changelog
4. Publish to Homebrew

## Questions?

- 📖 Check [documentation](./docs)
- 💬 Open an issue to discuss
- 🐛 Report bugs with details

Thank you for contributing to monkon! 🎉
