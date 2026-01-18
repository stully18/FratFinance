"""
Real Market Data Fetcher

Fetches live market data for ETFs (VOO, VXUS, BND, SPY, etc.)
Uses Alpha Vantage API (free tier: 25 requests/day)
"""

import requests
import os
from typing import Dict, Optional
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

# Alpha Vantage API key (free tier)
# Get yours at: https://www.alphavantage.co/support/#api-key
ALPHA_VANTAGE_API_KEY = os.getenv('ALPHA_VANTAGE_API_KEY', 'demo')

# Fallback to Yahoo Finance if Alpha Vantage fails
YAHOO_FINANCE_API = "https://query1.finance.yahoo.com/v8/finance/chart/{symbol}"


def get_voo_live_data() -> Dict:
    """
    Get live VOO data including:
    - Current price
    - YTD return
    - 1-year return
    - 5-year average annual return
    """
    try:
        # Try Alpha Vantage first
        url = f"https://www.alphavantage.co/query"
        params = {
            "function": "GLOBAL_QUOTE",
            "symbol": "VOO",
            "apikey": ALPHA_VANTAGE_API_KEY
        }

        response = requests.get(url, params=params, timeout=5)
        data = response.json()

        if "Global Quote" in data and data["Global Quote"]:
            quote = data["Global Quote"]
            current_price = float(quote.get("05. price", 0))
            change_percent = float(quote.get("10. change percent", "0").replace("%", ""))

            return {
                "ticker": "VOO",
                "price": round(current_price, 2),
                "change_percent_today": round(change_percent, 2),
                "ytd_return": None,  # Alpha Vantage doesn't provide this easily
                "one_year_return": None,
                "five_year_avg_return": 10.0,  # Historical average
                "data_source": "Alpha Vantage",
                "last_updated": datetime.now().isoformat()
            }
        else:
            # Fallback to Yahoo Finance
            return get_voo_data_yahoo()

    except Exception as e:
        print(f"[ERROR] Alpha Vantage fetch failed: {str(e)}")
        # Fallback to Yahoo Finance
        return get_voo_data_yahoo()


def get_voo_data_yahoo() -> Dict:
    """
    Fallback: Get VOO data from Yahoo Finance (free, no API key needed)
    """
    try:
        url = YAHOO_FINANCE_API.format(symbol="VOO")
        params = {
            "range": "1y",
            "interval": "1d"
        }

        response = requests.get(url, params=params, timeout=5)
        data = response.json()

        if "chart" in data and "result" in data["chart"]:
            result = data["chart"]["result"][0]
            meta = result.get("meta", {})

            current_price = meta.get("regularMarketPrice", 0)
            previous_close = meta.get("previousClose", 0)

            # Calculate daily change
            if previous_close > 0:
                change_percent = ((current_price - previous_close) / previous_close) * 100
            else:
                change_percent = 0

            # Get historical data for YTD calculation
            timestamps = result.get("timestamp", [])
            closes = result["indicators"]["quote"][0].get("close", [])

            # Calculate YTD return
            ytd_return = None
            if timestamps and closes:
                # Find first trading day of current year
                current_year = datetime.now().year
                year_start = datetime(current_year, 1, 1)

                # Find closest price to year start
                year_start_price = None
                for i, ts in enumerate(timestamps):
                    dt = datetime.fromtimestamp(ts)
                    if dt.year == current_year and closes[i] is not None:
                        year_start_price = closes[i]
                        break

                if year_start_price and current_price:
                    ytd_return = ((current_price - year_start_price) / year_start_price) * 100

            # Calculate 1-year return (first vs last price)
            one_year_return = None
            if len(closes) > 0 and closes[0] is not None and current_price:
                one_year_return = ((current_price - closes[0]) / closes[0]) * 100

            return {
                "ticker": "VOO",
                "price": round(current_price, 2),
                "change_percent_today": round(change_percent, 2),
                "ytd_return": round(ytd_return, 2) if ytd_return else None,
                "one_year_return": round(one_year_return, 2) if one_year_return else None,
                "five_year_avg_return": 10.0,  # Historical average
                "data_source": "Yahoo Finance",
                "last_updated": datetime.now().isoformat()
            }

    except Exception as e:
        print(f"[ERROR] Yahoo Finance fetch failed: {str(e)}")
        # Return default values
        return get_default_market_data()


def get_default_market_data() -> Dict:
    """
    Return default/cached market data if all APIs fail

    Using realistic demo values to show what the feature looks like
    (In production with API access, these would be real-time values)
    """
    return {
        "ticker": "VOO",
        "price": 527.85,  # Realistic VOO price for Jan 2026
        "change_percent_today": 0.45,  # Small positive gain
        "ytd_return": 2.3,  # Year-to-date performance
        "one_year_return": 24.8,  # Strong 2025 performance
        "five_year_avg_return": 14.2,  # Historical 5-year average
        "data_source": "Demo Mode (external APIs unavailable)",
        "last_updated": datetime.now().isoformat(),
        "note": "Demo values - connect Alpha Vantage or Yahoo Finance API for live data"
    }


def get_etf_details(ticker: str) -> Dict:
    """
    Get detailed ETF information including price, returns, and expense ratio.

    Returns comprehensive data for portfolio planning.
    """
    try:
        # Try Yahoo Finance for historical data
        url = YAHOO_FINANCE_API.format(symbol=ticker)
        params = {
            "range": "1y",
            "interval": "1d"
        }

        response = requests.get(url, params=params, timeout=5)
        data = response.json()

        if "chart" in data and "result" in data["chart"]:
            result = data["chart"]["result"][0]
            meta = result.get("meta", {})

            current_price = meta.get("regularMarketPrice", 0)
            previous_close = meta.get("previousClose", 0)

            # Calculate daily change
            if previous_close > 0:
                change_percent = ((current_price - previous_close) / previous_close) * 100
            else:
                change_percent = 0

            # Get historical data
            timestamps = result.get("timestamp", [])
            closes = result["indicators"]["quote"][0].get("close", [])

            # Calculate YTD return
            ytd_return = None
            if timestamps and closes:
                current_year = datetime.now().year
                year_start_price = None
                for i, ts in enumerate(timestamps):
                    dt = datetime.fromtimestamp(ts)
                    if dt.year == current_year and closes[i] is not None:
                        year_start_price = closes[i]
                        break

                if year_start_price and current_price:
                    ytd_return = ((current_price - year_start_price) / year_start_price) * 100

            # Calculate 1-year return
            one_year_return = None
            if len(closes) > 0 and closes[0] is not None and current_price:
                one_year_return = ((current_price - closes[0]) / closes[0]) * 100

            # ETF-specific data (static - would need additional API for real-time)
            expense_ratios = {
                "VOO": 0.03,
                "VXUS": 0.07,
                "BND": 0.03,
                "VTI": 0.03,
                "QQQ": 0.20,
                "AGG": 0.03,
                "VNQ": 0.12,
                "VWO": 0.08
            }

            return {
                "ticker": ticker,
                "price": round(current_price, 2),
                "change_percent_today": round(change_percent, 2),
                "ytd_return": round(ytd_return, 2) if ytd_return else None,
                "one_year_return": round(one_year_return, 2) if one_year_return else None,
                "expense_ratio": expense_ratios.get(ticker, 0.10),
                "data_source": "Yahoo Finance",
                "last_updated": datetime.now().isoformat()
            }
    except Exception as e:
        print(f"[ERROR] Failed to fetch {ticker} details: {str(e)}")

    # Return demo data for common ETFs
    demo_data = get_demo_etf_data(ticker)
    return demo_data


def get_demo_etf_data(ticker: str) -> Dict:
    """
    Return demo data for common ETFs when API is unavailable.
    """
    etf_demos = {
        "VOO": {
            "ticker": "VOO",
            "name": "Vanguard S&P 500 ETF",
            "price": 527.85,
            "change_percent_today": 0.45,
            "ytd_return": 2.3,
            "one_year_return": 24.8,
            "expense_ratio": 0.03,
            "category": "US Large Cap Stocks"
        },
        "VTI": {
            "ticker": "VTI",
            "name": "Vanguard Total Stock Market ETF",
            "price": 289.50,
            "change_percent_today": 0.52,
            "ytd_return": 2.1,
            "one_year_return": 23.5,
            "expense_ratio": 0.03,
            "category": "US Total Market"
        },
        "VXUS": {
            "ticker": "VXUS",
            "name": "Vanguard Total International Stock ETF",
            "price": 68.20,
            "change_percent_today": 0.38,
            "ytd_return": 1.8,
            "one_year_return": 14.2,
            "expense_ratio": 0.07,
            "category": "International Stocks"
        },
        "BND": {
            "ticker": "BND",
            "name": "Vanguard Total Bond Market ETF",
            "price": 72.15,
            "change_percent_today": -0.12,
            "ytd_return": 0.5,
            "one_year_return": 3.8,
            "expense_ratio": 0.03,
            "category": "US Bonds"
        },
        "AGG": {
            "ticker": "AGG",
            "name": "iShares Core US Aggregate Bond ETF",
            "price": 98.45,
            "change_percent_today": -0.10,
            "ytd_return": 0.6,
            "one_year_return": 4.1,
            "expense_ratio": 0.03,
            "category": "US Bonds"
        },
        "VNQ": {
            "ticker": "VNQ",
            "name": "Vanguard Real Estate ETF",
            "price": 84.32,
            "change_percent_today": 0.65,
            "ytd_return": 1.2,
            "one_year_return": 8.5,
            "expense_ratio": 0.12,
            "category": "Real Estate"
        },
        "QQQ": {
            "ticker": "QQQ",
            "name": "Invesco QQQ Trust (Nasdaq-100)",
            "price": 512.75,
            "change_percent_today": 0.88,
            "ytd_return": 3.5,
            "one_year_return": 32.1,
            "expense_ratio": 0.20,
            "category": "US Tech Stocks"
        },
        "VWO": {
            "ticker": "VWO",
            "name": "Vanguard Emerging Markets ETF",
            "price": 45.60,
            "change_percent_today": 0.42,
            "ytd_return": 1.5,
            "one_year_return": 11.8,
            "expense_ratio": 0.08,
            "category": "Emerging Markets"
        }
    }

    if ticker in etf_demos:
        data = etf_demos[ticker].copy()
        data["data_source"] = "Demo Mode"
        data["last_updated"] = datetime.now().isoformat()
        return data

    # Generic fallback
    return {
        "ticker": ticker,
        "price": 100.0,
        "change_percent_today": 0.0,
        "ytd_return": 0.0,
        "one_year_return": 0.0,
        "expense_ratio": 0.10,
        "data_source": "Demo Mode",
        "last_updated": datetime.now().isoformat()
    }


def get_multiple_etf_data(tickers: list = ["VOO", "VXUS", "BND"]) -> Dict:
    """
    Get data for multiple ETFs
    Note: Free APIs have rate limits, so use sparingly
    """
    results = {}

    for ticker in tickers:
        try:
            if ticker == "VOO":
                results[ticker] = get_voo_live_data()
            else:
                # For other tickers, use Yahoo Finance
                url = YAHOO_FINANCE_API.format(symbol=ticker)
                params = {"range": "1d", "interval": "1d"}

                response = requests.get(url, params=params, timeout=3)
                data = response.json()

                if "chart" in data and "result" in data["chart"]:
                    result = data["chart"]["result"][0]
                    meta = result.get("meta", {})

                    current_price = meta.get("regularMarketPrice", 0)
                    previous_close = meta.get("previousClose", 0)

                    if previous_close > 0:
                        change_percent = ((current_price - previous_close) / previous_close) * 100
                    else:
                        change_percent = 0

                    results[ticker] = {
                        "ticker": ticker,
                        "price": round(current_price, 2),
                        "change_percent_today": round(change_percent, 2),
                        "data_source": "Yahoo Finance",
                        "last_updated": datetime.now().isoformat()
                    }
        except Exception as e:
            print(f"[ERROR] Failed to fetch {ticker}: {str(e)}")
            results[ticker] = {
                "ticker": ticker,
                "price": None,
                "error": str(e)
            }

    return results


def get_sp500_performance() -> Dict:
    """
    Get S&P 500 performance data for comparison
    """
    try:
        # Fetch SPY (S&P 500 ETF) as proxy
        url = YAHOO_FINANCE_API.format(symbol="SPY")
        params = {
            "range": "1y",
            "interval": "1d"
        }

        response = requests.get(url, params=params, timeout=5)
        data = response.json()

        if "chart" in data and "result" in data["chart"]:
            result = data["chart"]["result"][0]
            meta = result.get("meta", {})

            current_price = meta.get("regularMarketPrice", 0)
            timestamps = result.get("timestamp", [])
            closes = result["indicators"]["quote"][0].get("close", [])

            # Calculate 1-year return
            one_year_return = None
            if len(closes) > 0 and closes[0] is not None and current_price:
                one_year_return = ((current_price - closes[0]) / closes[0]) * 100

            return {
                "index": "S&P 500",
                "one_year_return": round(one_year_return, 2) if one_year_return else None,
                "historical_avg_return": 10.0,
                "note": "S&P 500 tracks 500 largest US companies",
                "last_updated": datetime.now().isoformat()
            }
    except Exception as e:
        print(f"[ERROR] S&P 500 fetch failed: {str(e)}")
        return {
            "index": "S&P 500",
            "one_year_return": None,
            "historical_avg_return": 10.0,
            "error": str(e)
        }
