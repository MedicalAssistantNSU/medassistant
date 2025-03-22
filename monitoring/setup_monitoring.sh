#!/bin/bash

# Variables
PROMETHEUS_CONFIG_PATH="/usr/local/etc/prometheus/prometheus.yml"
PUSHGATEWAY_VERSION="1.11.0"
PUSHGATEWAY_DIR="/usr/local/bin"
GRAFANA_PROVISIONING_DASHBOARDS="/usr/local/etc/grafana/provisioning/dashboards"
GRAFANA_DASHBOARD_JSON_PATH="./ocr_dashboard.json"
GRAFANA_DASHBOARD_YAML_PATH="$GRAFANA_PROVISIONING_DASHBOARDS/dashboard.yaml"
GRAFANA_PROVISIONING_DATASOURCES="/usr/local/etc/grafana/provisioning/datasources"
GRAFANA_DATASOURCE_YAML_PATH="$GRAFANA_PROVISIONING_DATASOURCES/datasource.yaml"

# Step 1: Install Prometheus
echo "Installing Prometheus..."
brew install prometheus

# Step 2: Configure Prometheus for Pushgateway
echo "Configuring Prometheus to scrape Pushgateway..."
sudo mkdir -p /usr/local/etc/prometheus
cat <<EOL | sudo tee $PROMETHEUS_CONFIG_PATH
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'pushgateway'
    static_configs:
      - targets: ['localhost:9091']
EOL

# Step 3: Start Prometheus service
echo "Starting Prometheus..."
brew services start prometheus

# Step 4: Install Pushgateway
echo "Installing Pushgateway..."
if ! command -v pushgateway &> /dev/null
then
    curl -LO "https://github.com/prometheus/pushgateway/releases/download/v$PUSHGATEWAY_VERSION/pushgateway-$PUSHGATEWAY_VERSION.darwin-amd64.tar.gz"
    tar -xvzf "pushgateway-$PUSHGATEWAY_VERSION.darwin-amd64.tar.gz"
    sudo mv "pushgateway-$PUSHGATEWAY_VERSION.darwin-amd64/pushgateway" $PUSHGATEWAY_DIR
    rm -rf "pushgateway-$PUSHGATEWAY_VERSION.darwin-amd64" "pushgateway-$PUSHGATEWAY_VERSION.darwin-amd64.tar.gz"
    echo "Pushgateway installed."
else
    echo "Pushgateway is already installed."
fi

# Step 5: Start Pushgateway service
echo "Starting Pushgateway..."
pushgateway &

# Step 6: Install Grafana
echo "Installing Grafana..."
brew install grafana

# Step 7: Provision Grafana Datasource
echo "Provisioning Grafana datasource..."
sudo mkdir -p $GRAFANA_PROVISIONING_DATASOURCES
sudo tee $GRAFANA_DATASOURCE_YAML_PATH > /dev/null <<EOL
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://localhost:9090
    isDefault: true
    editable: true
EOL
echo "Grafana datasource YAML file created."

# Step 8: Provision Grafana Dashboard
echo "Provisioning Grafana dashboard..."
sudo mkdir -p $GRAFANA_PROVISIONING_DASHBOARDS

# Copy the dashboard JSON file
SCRIPT_DIR=$(dirname "$0")
SOURCE_DASHBOARD_JSON="$SCRIPT_DIR/dashboard.json"
if [ -f "$SOURCE_DASHBOARD_JSON" ]; then
  sudo cp "$SOURCE_DASHBOARD_JSON" $GRAFANA_DASHBOARD_JSON_PATH
  echo "Dashboard JSON file copied to provisioning directory."
else
  echo "Warning: Dashboard JSON file not found at $SOURCE_DASHBOARD_JSON"
fi

# Create the provisioning YAML file for dashboards
sudo tee $GRAFANA_DASHBOARD_YAML_PATH > /dev/null <<EOL
apiVersion: 1

providers:
  - name: 'default'
    orgId: 1
    folder: ''
    type: file
    disableDeletion: false
    updateIntervalSeconds: 10
    options:
      path: $GRAFANA_PROVISIONING_DASHBOARDS
EOL
echo "Grafana dashboard provisioning YAML file created."

# Step 9: Restart Grafana to apply the changes
echo "Restarting Grafana..."
brew services restart grafana

echo "Setup complete!"
echo "Prometheus, Pushgateway, and Grafana have been installed and configured."
echo "To access the Grafana dashboard, visit http://localhost:3000"
echo "Default login: admin/admin"
