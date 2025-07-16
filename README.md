# Ukrainian Bank Deposit Calculator

A professional web-based calculator for Ukrainian bank deposits with European number formatting, custom color scheme, and comprehensive form validation.

## 🌟 Features

### **Core Functionality**
- **European Number Formatting** - Supports dots for thousands (10.000, 1.000.000) and commas for decimals (15,5%)
- **Multi-Currency Support** - UAH (₴), USD ($), EUR (€) with proper symbol display
- **Comprehensive Calculations** - Interest rates, taxes (PDFO + Military tax), fees, and net income
- **NBU Compliance** - Calculations follow Ukrainian National Bank regulations

### **User Experience**
- **Professional Banking Design** - Light gray (#ececec) backgrounds with black text and gold yellow (#ffd700) accents
- **Mobile-Friendly** - Responsive design with appropriate input modes for mobile devices
- **Real-Time Validation** - European format validation with clear error messages
- **Accessibility** - WCAG-compliant with proper focus states and keyboard navigation

### **Technical Features**
- **Large Number Support** - Handles deposits up to 10 billion UAH
- **Smart Input Parsing** - Separate parsing logic for monetary amounts and percentages
- **Form Validation** - Comprehensive validation with submission-based error display
- **Cross-Browser Compatible** - Works on all modern browsers

## 🚀 Quick Start

### **Local Development**
```bash
# Clone the repository
git clone https://github.com/vsevolodanhelis/avngrd.git
cd avngrd

# Start a local server (using Node.js http-server)
npx http-server

# Or use Python
python -m http.server 3000

# Or use PHP
php -S localhost:3000
```

### **Access the Calculator**
Open your browser and navigate to:
- **Main Calculator**: `http://localhost:3000`
- **Test Page**: `http://localhost:3000/test-parsing.html`

## 📁 Project Structure

```
avngrd/
├── index.html              # Main calculator interface
├── js/
│   ├── calculator.js       # Core calculation logic
│   └── ui.js              # UI handling and form validation
├── styles/
│   └── main.css           # Additional custom styles
├── test-parsing.html      # Number formatting test page
├── package.json           # Project configuration
└── README.md             # This file
```

## 🔧 Technical Implementation

### **Number Formatting System**
- **Large Numbers**: `1000000` → `1.000.000` (European format with dots)
- **Percentages**: `15.5` → `15,5` (European decimal with comma)
- **Currency**: Proper symbol display (₴, $, €) with formatting

### **Form Validation**
- **Deposit Amount**: 1.000 to 10.000.000.000 UAH
- **Interest Rate**: 0,1% to 50% with decimal support
- **Term**: Flexible months/years selection
- **Taxes**: PDFO and Military tax with current Ukrainian rates

### **Color Scheme**
- **Primary Background**: Light gray (#ececec) with gradients
- **Text**: High contrast black (#000000)
- **Accents**: Professional gold yellow (#ffd700)
- **Cards**: Clean white (#ffffff) with subtle shadows

## 🎯 Usage Examples

### **Basic Calculation**
1. Enter deposit amount: `100.000` (100,000 UAH)
2. Select currency: UAH (₴)
3. Set term: `12` months
4. Enter interest rate: `15,5%`
5. Click "Розрахувати доходність"

### **Advanced Features**
- **Additional Fees**: Enter bank service fees
- **Tax Settings**: Customize PDFO and military tax rates
- **Multiple Currencies**: Compare deposits in UAH, USD, EUR

## 🌐 Browser Support

- **Chrome 80+** - Full functionality
- **Firefox 75+** - Complete feature support
- **Safari 13+** - All features working
- **Edge 80+** - Full compatibility
- **Mobile Browsers** - Optimized for touch interfaces

## 📱 Mobile Features

- **Numeric Keypad** - Automatic numeric input on mobile
- **Touch-Friendly** - Large touch targets and smooth interactions
- **Responsive Design** - Adapts to all screen sizes
- **Fast Loading** - Optimized for mobile networks

## 🔒 Security & Privacy

- **Client-Side Only** - No data sent to external servers
- **Input Validation** - Comprehensive sanitization and validation
- **XSS Protection** - Secure input handling
- **No Tracking** - Privacy-focused implementation

## 🤝 Contributing

This calculator was developed for Ukrainian banking needs. Contributions are welcome for:
- Additional banking features
- Accessibility improvements
- Performance optimizations
- Bug fixes and enhancements

## 📄 License

This project is open source and available under the MIT License.

## 🏦 Banking Compliance

Calculations are performed according to:
- **NBU Regulation 223** - Ukrainian National Bank requirements
- **Current Tax Rates** - PDFO (18%) and Military Tax (1.5%)
- **Deposit Insurance** - Information about Ukrainian deposit guarantee fund

## 📞 Support

For questions or issues, please open an issue on GitHub or contact the development team.

---

**Professional Ukrainian Bank Deposit Calculator** - Built with modern web technologies for accurate financial calculations.
