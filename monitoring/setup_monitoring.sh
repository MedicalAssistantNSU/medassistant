#!/bin/bash

# Variables
PROMETHEUS_CONFIG_PATH="/usr/local/etc/prometheus/prometheus.yml"
PUSHGATEWAY_VERSION="1.11.0"
PUSHGATEWAY_DIR="/usr/local/bin"
GRAFANA_CONFIG_PATH="/usr/local/etc/grafana/provisioning/dashboards"
GRAFANA_DASHBOARD_JSON_PATH="/usr/local/etc/grafana/provisioning/dashboards/dashboard.json"
GRAFANA_DASHBOARD_YAML_PATH="/usr/local/etc/grafana/provisioning/dashboards/dashboard.yaml"

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
# IMPORTANT !!! This is a setup for Intel-based Macbook, if you have Apple Silicon - find the suitable release for you (darwin-arm64 probably)
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

# Step 7: Configure Grafana dashboard
echo "Setting up Grafana dashboard..."
sudo mkdir -p $GRAFANA_CONFIG_PATH

cat <<EOL | sudo tee $GRAFANA_DASHBOARD_JSON_PATH
{
  "id": 1,
  "type": "timeseries",
  "title": "Panel Title",
  "gridPos": {
    "x": 0,
    "y": 0,
    "h": 8,
    "w": 12
  },
  "fieldConfig": {
    "defaults": {
      "custom": {
        "drawStyle": "line",
        "lineInterpolation": "smooth",
        "barAlignment": 0,
        "barWidthFactor": 0.6,
        "lineWidth": 1,
        "fillOpacity": 0,
        "gradientMode": "none",
        "spanNulls": false,
        "insertNulls": false,
        "showPoints": "auto",
        "pointSize": 5,
        "stacking": {
          "mode": "none",
          "group": "A"
        },
        "axisPlacement": "auto",
        "axisLabel": "",
        "axisColorMode": "text",
        "axisBorderShow": false,
        "scaleDistribution": {
          "type": "linear"
        },
        "axisCenteredZero": false,
        "hideFrom": {
          "tooltip": false,
          "viz": false,
          "legend": false
        },
        "thresholdsStyle": {
          "mode": "off"
        }
      },
      "color": {
        "mode": "palette-classic"
      },
      "mappings": [],
      "thresholds": {
        "mode": "absolute",
        "steps": [
          {
            "color": "green",
            "value": null
          },
          {
            "color": "red",
            "value": 80
          }
        ]
      },
      "fieldMinMax": false
    },
    "overrides": []
  },
  "pluginVersion": "11.5.1",
  "targets": [
    {
      "datasource": {
        "type": "prometheus",
        "uid": "eeemedz3k9e68b"
      },
      "disableTextWrap": false,
      "editorMode": "builder",
      "expr": "histogram_quantile(0.95, sum by(le) (rate(document_ocr_seconds_bucket[5m])))",
      "fullMetaSearch": false,
      "hide": false,
      "includeNullMetadata": false,
      "instant": false,
      "legendFormat": "OCR Processing Time (95th percentile)",
      "range": true,
      "refId": "A",
      "useBackend": false
    },
    {
      "datasource": {
        "type": "prometheus",
        "uid": "eeemedz3k9e68b"
      },
      "disableTextWrap": false,
      "editorMode": "builder",
      "expr": "rate(document_ocr_seconds_sum[5m])",
      "fullMetaSearch": false,
      "hide": false,
      "includeNullMetadata": false,
      "instant": false,
      "legendFormat": "OCR Total Processing Time Rate",
      "range": true,
      "refId": "B",
      "useBackend": false
    },
    {
      "datasource": {
        "type": "prometheus",
        "uid": "eeemedz3k9e68b"
      },
      "disableTextWrap": false,
      "editorMode": "builder",
      "expr": "histogram_quantile(0.95, sum by(le) (rate(document_preprocess_seconds_bucket[5m])))",
      "fullMetaSearch": false,
      "hide": false,
      "includeNullMetadata": false,
      "instant": false,
      "legendFormat": "Preprocessing Time (95th percentile)",
      "range": true,
      "refId": "C",
      "useBackend": false
    },
    {
      "datasource": {
        "type": "prometheus",
        "uid": "eeemedz3k9e68b"
      },
      "disableTextWrap": false,
      "editorMode": "builder",
      "expr": "rate(document_preprocess_seconds_sum[5m])",
      "fullMetaSearch": false,
      "hide": false,
      "includeNullMetadata": false,
      "instant": false,
      "legendFormat": "Preprocessing Total Time Rate",
      "range": true,
      "refId": "D",
      "useBackend": false
    },
    {
      "datasource": {
        "type": "prometheus",
        "uid": "eeemedz3k9e68b"
      },
      "disableTextWrap": false,
      "editorMode": "builder",
      "expr": "rate(document_total_seconds_sum[5m])",
      "fullMetaSearch": false,
      "hide": false,
      "includeNullMetadata": false,
      "instant": false,
      "legendFormat": "Overall Processing Time Rate",
      "range": true,
      "refId": "E",
      "useBackend": false
    },
    {
      "datasource": {
        "type": "prometheus",
        "uid": "eeemedz3k9e68b"
      },
      "disableTextWrap": false,
      "editorMode": "builder",
      "expr": "rate(document_ocr_seconds_count[5m])",
      "fullMetaSearch": false,
      "hide": false,
      "includeNullMetadata": false,
      "instant": false,
      "legendFormat": "OCR Requests per 5 min",
      "range": true,
      "refId": "F",
      "useBackend": false
    },
    {
      "datasource": {
        "type": "prometheus",
        "uid": "eeemedz3k9e68b"
      },
      "disableTextWrap": false,
      "editorMode": "builder",
      "expr": "rate(document_preprocess_seconds_count[5m])",
      "fullMetaSearch": false,
      "hide": false,
      "includeNullMetadata": false,
      "instant": false,
      "legendFormat": "Preprocessing requests per 5 min",
      "range": true,
      "refId": "G",
      "useBackend": false
    },
    {
      "datasource": {
        "type": "prometheus",
        "uid": "eeemedz3k9e68b"
      },
      "disableTextWrap": false,
      "editorMode": "builder",
      "expr": "rate(document_total_seconds_count[5m])",
      "fullMetaSearch": false,
      "hide": false,
      "includeNullMetadata": false,
      "instant": false,
      "legendFormat": "Total requests per 5 min",
      "range": true,
      "refId": "H",
      "useBackend": false
    }
  ],
  "datasource": {
    "type": "prometheus",
    "uid": "eeemedz3k9e68b"
  },
  "options": {
    "tooltip": {
      "mode": "single",
      "sort": "none",
      "hideZeros": false
    },
    "legend": {
      "showLegend": true,
      "displayMode": "list",
      "placement": "bottom",
      "calcs": []
    }
  }
}
EOL

cat <<EOL | sudo tee $GRAFANA_DASHBOARD_YAML_PATH
apiVersion: 1
providers:
  - name: 'default'
    orgId: 1
    folder: ''
    type: file
    disableDeletion: false
    updateIntervalSeconds: 60
    options:
      path: /usr/local/etc/grafana/provisioning/dashboards/
EOL

# Step 8: Restart Grafana to apply the changes
echo "Restarting Grafana..."
brew services restart grafana

echo "Setup complete!"
echo "Prometheus, Pushgateway, and Grafana have been installed and configured."

# Output reminder
echo "To access Grafana dashboard, visit http://localhost:3000"
echo "Default login: admin/admin"
