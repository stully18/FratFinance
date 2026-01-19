"""
Real Market Data Fetcher

Fetches live market data for ETFs (VOO, VXUS, BND, SPY, etc.)
Uses yfinance library for reliable Yahoo Finance data
"""

import yfinance as yf
from typing import Dict
from datetime import datetime, timedelta


def get_voo_live_data() -> Dict:
    """
    Get live VOO data including:
    - Current price
    - YTD return
    - 1-year return
    - 5-year average annual return
    """
    try:
        print("[DEBUG] Fetching live VOO market data with yfinance...")
        ticker = yf.Ticker("VOO")

        # Get current info
        info = ticker.info
        current_price = info.get("regularMarketPrice") or info.get("previousClose", 0)
        previous_close = info.get("previousClose", 0)

        # Calculate daily change
        if previous_close > 0 and current_price > 0:
            change_percent = ((current_price - previous_close) / previous_close) * 100
        else:
            change_percent = 0

        # Get historical data for YTD and 1-year calculations
        hist = ticker.history(period="1y")

        ytd_return = None
        one_year_return = None

        if not hist.empty:
            # Calculate 1-year return
            first_price = hist['Close'].iloc[0]
            last_price = hist['Close'].iloc[-1]
            if first_price > 0:
                one_year_return = ((last_price - first_price) / first_price) * 100

            # Calculate YTD return
            current_year = datetime.now().year
            ytd_data = hist[hist.index.year == current_year]
            if not ytd_data.empty:
                year_start_price = ytd_data['Close'].iloc[0]
                if year_start_price > 0:
                    ytd_return = ((last_price - year_start_price) / year_start_price) * 100

        print(f"[DEBUG] VOO: ${current_price:.2f} ({change_percent:+.2f}% today) - Source: Yahoo Finance (yfinance)")

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
        print(f"[ERROR] yfinance fetch failed: {str(e)}")
        return get_default_market_data()


def get_default_market_data() -> Dict:
    """
    Return default/cached market data if API fails
    """
    return {
        "ticker": "VOO",
        "price": 527.85,
        "change_percent_today": 0.45,
        "ytd_return": 2.3,
        "one_year_return": 24.8,
        "five_year_avg_return": 10.0,
        "data_source": "Demo Mode (yfinance unavailable)",
        "last_updated": datetime.now().isoformat()
    }


def get_etf_details(ticker_symbol: str) -> Dict:
    """
    Get detailed ETF information including price, returns, and expense ratio.
    """
    try:
        ticker = yf.Ticker(ticker_symbol)
        info = ticker.info

        current_price = info.get("regularMarketPrice") or info.get("previousClose", 0)
        previous_close = info.get("previousClose", 0)

        # Calculate daily change
        if previous_close > 0 and current_price > 0:
            change_percent = ((current_price - previous_close) / previous_close) * 100
        else:
            change_percent = 0

        # Get historical data
        hist = ticker.history(period="1y")

        ytd_return = None
        one_year_return = None

        if not hist.empty:
            first_price = hist['Close'].iloc[0]
            last_price = hist['Close'].iloc[-1]
            if first_price > 0:
                one_year_return = ((last_price - first_price) / first_price) * 100

            current_year = datetime.now().year
            ytd_data = hist[hist.index.year == current_year]
            if not ytd_data.empty:
                year_start_price = ytd_data['Close'].iloc[0]
                if year_start_price > 0:
                    ytd_return = ((last_price - year_start_price) / year_start_price) * 100

        # ETF expense ratios (static data)
        expense_ratios = {
            "VOO": 0.03, "VXUS": 0.07, "BND": 0.03, "VTI": 0.03,
            "QQQ": 0.20, "AGG": 0.03, "VNQ": 0.12, "VWO": 0.08
        }

        return {
            "ticker": ticker_symbol,
            "price": round(current_price, 2),
            "change_percent_today": round(change_percent, 2),
            "ytd_return": round(ytd_return, 2) if ytd_return else None,
            "one_year_return": round(one_year_return, 2) if one_year_return else None,
            "expense_ratio": expense_ratios.get(ticker_symbol, 0.10),
            "data_source": "Yahoo Finance",
            "last_updated": datetime.now().isoformat()
        }

    except Exception as e:
        print(f"[ERROR] Failed to fetch {ticker_symbol}: {str(e)}")
        return get_demo_etf_data(ticker_symbol)


def get_demo_etf_data(ticker: str) -> Dict:
    """
    Return demo data for common ETFs when API is unavailable.
    """
    etf_demos = {
        "VOO": {"ticker": "VOO", "name": "Vanguard S&P 500 ETF", "price": 527.85, "change_percent_today": 0.45, "ytd_return": 2.3, "one_year_return": 24.8, "expense_ratio": 0.03},
        "VTI": {"ticker": "VTI", "name": "Vanguard Total Stock Market ETF", "price": 289.50, "change_percent_today": 0.52, "ytd_return": 2.1, "one_year_return": 23.5, "expense_ratio": 0.03},
        "VXUS": {"ticker": "VXUS", "name": "Vanguard Total International Stock ETF", "price": 68.20, "change_percent_today": 0.38, "ytd_return": 1.8, "one_year_return": 14.2, "expense_ratio": 0.07},
        "BND": {"ticker": "BND", "name": "Vanguard Total Bond Market ETF", "price": 72.15, "change_percent_today": -0.12, "ytd_return": 0.5, "one_year_return": 3.8, "expense_ratio": 0.03},
        "AGG": {"ticker": "AGG", "name": "iShares Core US Aggregate Bond ETF", "price": 98.45, "change_percent_today": -0.10, "ytd_return": 0.6, "one_year_return": 4.1, "expense_ratio": 0.03},
        "VNQ": {"ticker": "VNQ", "name": "Vanguard Real Estate ETF", "price": 84.32, "change_percent_today": 0.65, "ytd_return": 1.2, "one_year_return": 8.5, "expense_ratio": 0.12},
        "QQQ": {"ticker": "QQQ", "name": "Invesco QQQ Trust (Nasdaq-100)", "price": 512.75, "change_percent_today": 0.88, "ytd_return": 3.5, "one_year_return": 32.1, "expense_ratio": 0.20},
        "VWO": {"ticker": "VWO", "name": "Vanguard Emerging Markets ETF", "price": 45.60, "change_percent_today": 0.42, "ytd_return": 1.5, "one_year_return": 11.8, "expense_ratio": 0.08}
    }

    if ticker in etf_demos:
        data = etf_demos[ticker].copy()
        data["data_source"] = "Demo Mode"
        data["last_updated"] = datetime.now().isoformat()
        return data

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
    """
    results = {}
    for ticker in tickers:
        results[ticker] = get_etf_details(ticker)
    return results


def get_sp500_performance() -> Dict:
    """
    Get S&P 500 performance data for comparison
    """
    try:
        ticker = yf.Ticker("SPY")
        hist = ticker.history(period="1y")

        one_year_return = None
        if not hist.empty:
            first_price = hist['Close'].iloc[0]
            last_price = hist['Close'].iloc[-1]
            if first_price > 0:
                one_year_return = ((last_price - first_price) / first_price) * 100

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
