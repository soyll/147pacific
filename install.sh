#!/bin/bash

echo "🚀 Saleor Quickstart Installation Script"
echo "======================================="

# Check OS and architecture
OS="$(uname -s)"
ARCH="$(uname -m)"
echo "📋 Detecting OS: $OS ($ARCH)"

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        echo "❌ Docker not found"
        if [ "$OS" = "Darwin" ]; then
            echo "🔄 Installing Docker Desktop for Mac..."
            if [ "$ARCH" = "arm64" ]; then
                echo "📦 Detected Apple Silicon (M1/M2) Mac"
                brew install --cask docker
            elif [ "$ARCH" = "x86_64" ]; then
                echo "📦 Detected Intel Mac"
                brew install --cask docker
            else
                echo "⚠️ Unsupported Mac architecture: $ARCH"
                echo "Please install Docker Desktop manually from https://www.docker.com/products/docker-desktop"
                exit 1
            fi
            
            # Wait for Docker to start
            echo "⏳ Waiting for Docker to start..."
            echo "Please launch Docker Desktop from your Applications folder"
            while ! docker system info > /dev/null 2>&1; do
                sleep 2
            done
        elif [ "$OS" = "Linux" ]; then
            echo "🔄 Installing Docker for Linux..."
            curl -fsSL https://get.docker.com -o get-docker.sh
            sudo sh get-docker.sh
        else
            echo "⚠️ Please install Docker Desktop manually from https://www.docker.com/products/docker-desktop"
            exit 1
        fi
    else
        echo "✅ Docker is installed"
    fi
}

# Check if Tilt is installed
check_tilt() {
    if ! command -v tilt &> /dev/null; then
        echo "❌ Tilt not found"
        if [ "$OS" = "Darwin" ]; then
            echo "🔄 Installing Tilt for Mac..."
            if ! command -v brew &> /dev/null; then
                echo "❌ Homebrew is required but not installed"
                echo "📥 Installing Homebrew..."
                if [ "$ARCH" = "arm64" ]; then
                    echo "Using Homebrew installation for Apple Silicon Mac"
                    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
                    echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
                    eval "$(/opt/homebrew/bin/brew shellenv)"
                else
                    echo "Using Homebrew installation for Intel Mac"
                    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
                fi
            fi
            brew install tilt
        elif [ "$OS" = "Linux" ]; then
            echo "🔄 Installing Tilt for Linux..."
            curl -fsSL https://raw.githubusercontent.com/tilt-dev/tilt/master/scripts/install.sh | bash
        else
            echo "⚠️ Please install Tilt manually from https://docs.tilt.dev/install.html"
            exit 1
        fi
    else
        echo "✅ Tilt is installed"
        tilt_version=$(tilt version | head -n1 | awk '{print $2}')
        echo "📦 Tilt version: $tilt_version"
    fi
}

# Check if Kubernetes is enabled
check_kubernetes() {
    if ! kubectl version &> /dev/null; then
        echo "❌ Kubernetes is not enabled"
        echo "⚠️ Please enable Kubernetes in Docker Desktop:"
        echo "1. Open Docker Desktop"
        echo "2. Go to Settings -> Kubernetes"
        echo "3. Check 'Enable Kubernetes'"
        echo "4. Click 'Apply & Restart'"
        exit 1
    else
        echo "✅ Kubernetes is enabled"
    fi
}

# Pull required Docker images
pull_images() {
    echo "🔄 Pulling required Docker images..."
    docker pull ghcr.io/saleor/saleor:latest
    docker pull ghcr.io/saleor/saleor:3.x
}

# Main installation process
main() {
    echo "🔍 Checking requirements..."
    check_docker
    check_tilt
    check_kubernetes
    
    echo "🔧 Setting up environment..."
    pull_images
    
    echo "✨ Installation complete!"
    echo "
Next steps:
1. Run 'tilt up' to start the environment
2. Open http://localhost:10350 to view Tilt UI
3. Default admin credentials:
   - Email: admin@example.com
   - Password: admin
"
}

# Run main installation
main