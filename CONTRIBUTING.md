# Contributing to Prescription OCR

Thank you for your interest in contributing to the Prescription OCR project!

## 🎯 Ways to Contribute

- 🐛 Report bugs
- 💡 Suggest new features
- 📝 Improve documentation
- 🔧 Fix issues
- ✨ Add enhancements
- 🎨 Improve UI/UX
- 🚀 Help with deployment

---

## 🚀 Getting Started

### 1. Fork the Repository
```bash
git clone https://github.com/yourusername/prescription-ocr.git
cd prescription-ocr
```

### 2. Set Up Development Environment
```bash
# Backend
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt

# Frontend
cd ../frontend
npm install
```

### 3. Create a Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

---

## 📋 Development Guidelines

### Code Style

#### Python (Backend)
```python
# Follow PEP 8 style guide
# Use type hints where possible
def process_image(file_path: str) -> str:
    """
    Process an image file.
    
    Args:
        file_path: Path to the image file
        
    Returns:
        Extracted text as string
    """
    pass

# Use meaningful variable names
extracted_text = ocr.extract_text_from_image(image_path)

# Add docstrings to functions and classes
# Use comments for complex logic
```

#### JavaScript/React (Frontend)
```javascript
// Use camelCase for variables and functions
const handleFileUpload = (file) => {
  // Implementation
}

// Use descriptive component names
function UploadBox({ onUpload, isLoading }) {
  // Implementation
}

// Add JSDoc comments for complex functions
/**
 * Validates file before upload
 * @param {File} file - File to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const validateFile = (file) => {
  // Implementation
}

// Use meaningful component prop names
<UploadBox onUpload={handleUpload} isLoading={isLoading} />
```

### Naming Conventions
- **Functions**: `verb` + `noun` (e.g., `extractText`, `validateFile`)
- **Variables**: Descriptive and lowercase (e.g., `userInput`, `processingTime`)
- **Constants**: UPPERCASE_WITH_UNDERSCORES (e.g., `MAX_FILE_SIZE`)
- **Classes**: PascalCase (e.g., `GroqPrescriptionCleaner`)
- **Directories**: lowercase with hyphens (e.g., `src/components`)

### Code Organization

#### Backend
```
backend/
├── app.py              # Main application
├── ocr.py              # OCR functionality
├── groq_client.py      # Groq integration
├── config.py           # Configuration
└── utils/              # Utility functions (future)
```

#### Frontend
```
frontend/src/
├── App.jsx                    # Main component
├── components/
│   ├── UploadBox.jsx
│   ├── ResultCard.jsx
│   └── Loader.jsx
├── hooks/                     # Custom hooks (future)
│   └── useApi.js
└── utils/                     # Utility functions (future)
    └── api.js
```

---

## 🧪 Testing

### Backend Testing
```bash
# Add tests to backend/tests/ directory
cd backend
python -m pytest tests/ -v
```

### Frontend Testing
```bash
# Add tests to frontend/src/__tests__/ directory
cd frontend
npm test
```

### Manual Testing Checklist
- [ ] File upload works
- [ ] OCR extraction accurate
- [ ] Groq cleaning works
- [ ] PDF download works
- [ ] Copy to clipboard works
- [ ] Dark mode toggles
- [ ] Mobile responsive
- [ ] Error messages display
- [ ] History saves correctly
- [ ] All endpoints respond correctly

---

## 📝 Commit Guidelines

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (no logic)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Test additions/changes
- **chore**: Maintenance, dependency updates

### Examples
```
feat(upload): Add image preview functionality
fix(ocr): Handle rotated prescription images
docs(readme): Update installation instructions
style(frontend): Format React components
refactor(backend): Extract database logic
perf(ocr): Implement model caching
test(api): Add unit tests for upload endpoint
chore(deps): Update dependencies
```

### Subject Line
- Use imperative mood ("add" not "added")
- Don't capitalize first letter
- No period at end
- Limit to 50 characters

### Body
- Explain what and why, not how
- Wrap at 72 characters
- Separate from subject with blank line

### Example
```
feat(groq): Add support for mixtral model

- Add GROQ_MODEL environment variable
- Update groq_client.py to support model selection
- Add documentation for available models
- Test with mixtral-8x7b-32768

Closes #42
```

---

## 🔄 Pull Request Process

### 1. Create PR
- Base branch: `main` (or `develop` if exists)
- Compare branch: your feature branch
- Add clear title
- Add description

### 2. PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issue
Closes #123

## Testing Done
- [ ] Manual testing completed
- [ ] Test cases added
- [ ] No console errors
- [ ] Works on mobile

## Checklist
- [ ] Code follows style guide
- [ ] Updated documentation
- [ ] No breaking changes
- [ ] Dependencies updated in requirements/package files
```

### 3. Code Review
- Respond to feedback promptly
- Make requested changes in new commits
- Request re-review when ready

### 4. Merge
- Squash commits if needed
- Delete branch after merge
- Update relevant issues

---

## 📚 Documentation Guidelines

### Code Comments
```python
# Good: Explains why, not what
# Skip validation for internal API calls
if is_internal_call:
    return process_directly()

# Bad: Obvious comment
# Increment counter
counter += 1
```

### Docstrings
```python
def extract_text_from_image(image_path: str) -> str:
    """
    Extract text from prescription image using PaddleOCR.
    
    Args:
        image_path: Absolute path to prescription image
        
    Returns:
        Extracted text as a single string
        
    Raises:
        FileNotFoundError: If image file doesn't exist
        ValueError: If image format is not supported
        
    Example:
        >>> text = extract_text_from_image('/path/to/image.jpg')
        >>> print(text)
    """
```

### README Updates
- Update README.md if adding features
- Add new sections for major features
- Include examples
- Update table of contents

### API Documentation
- Update API_DOCS.md for endpoint changes
- Include request/response examples
- Document error codes
- Add curl examples

---

## 🐛 Bug Reports

### When Filing a Bug

**Include:**
- [ ] Clear title
- [ ] Description of issue
- [ ] Steps to reproduce
- [ ] Expected behavior
- [ ] Actual behavior
- [ ] Environment (OS, Python version, etc.)
- [ ] Screenshots/logs if applicable
- [ ] Error traceback

**Example:**
```markdown
### Title
OCR fails for rotated prescription images

### Description
When uploading a prescription that's rotated 45 degrees, 
the OCR extraction fails completely.

### Steps to Reproduce
1. Take a prescription photo at an angle
2. Upload to application
3. Wait for processing

### Expected Behavior
OCR should auto-rotate image and extract text

### Actual Behavior
Error message: "OCR processing failed"

### Environment
- OS: Windows 11
- Python: 3.10.5
- Browser: Chrome 120

### Logs
```
Error traceback here
```
```

---

## 💡 Feature Requests

### When Suggesting a Feature

**Include:**
- [ ] Clear title
- [ ] Description of feature
- [ ] Use cases / benefits
- [ ] Proposed implementation (if possible)
- [ ] Alternatives considered

**Example:**
```markdown
### Title
Support for batch prescription processing

### Description
Allow users to upload and process multiple prescriptions 
at once instead of one at a time.

### Benefits
- Faster workflow for clinics
- Better for bulk data entry
- Improved user efficiency

### Proposed Implementation
- Add batch endpoint: POST /batch-upload
- Accept multiple files
- Return array of results
- Show progress bar

### Alternatives
- ZIP file upload
- Drag multiple files
- Queue-based processing
```

---

## 🚀 Development Workflow

### Local Development
```bash
# 1. Start backend
cd backend
python app.py

# 2. Start frontend (in another terminal)
cd frontend
npm run dev

# 3. Open http://localhost:5173 in browser

# 4. Make changes and test
# 5. Check console for errors
# 6. Test all functionality
```

### Adding a Feature

#### Backend
1. Create function in appropriate module
2. Add docstring and type hints
3. Add to Flask endpoint
4. Test with curl or Postman
5. Update API_DOCS.md

#### Frontend
1. Create React component
2. Add props and state
3. Implement functionality
4. Style with Tailwind CSS
5. Test on mobile

#### Both
1. Update README.md
2. Add environment variables if needed
3. Update CHANGELOG (if exists)
4. Write tests
5. Make PR

---

## 🔍 Code Review Checklist

When reviewing PRs, check:

- [ ] Code style consistency
- [ ] Proper error handling
- [ ] No hardcoded values
- [ ] Type hints present (Python)
- [ ] Docstrings updated
- [ ] Comments explain why, not what
- [ ] No console.log/print statements
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No security issues
- [ ] Performance considerations
- [ ] Mobile responsiveness (frontend)
- [ ] CORS implications (backend)
- [ ] Environment variables documented

---

## 📦 Dependency Management

### Adding Dependencies

**Backend:**
```bash
# Install package
pip install package-name

# Add to requirements.txt
pip freeze | grep package-name >> backend/requirements.txt
```

**Frontend:**
```bash
# Install package
npm install package-name

# Verify package.json is updated
```

### Updating Dependencies

**Security Updates:**
- Update immediately
- Run tests
- Note in commit message

**Minor Updates:**
- Test thoroughly
- Document changes
- Update DEPENDENCIES.md

**Major Updates:**
- Coordinate with team
- Check for breaking changes
- Plan migration

---

## 🎓 Learning Resources

### Python/Flask
- [Flask Documentation](https://flask.palletsprojects.com/)
- [PEP 8 Style Guide](https://pep8.org/)
- [Python Type Hints](https://docs.python.org/3/library/typing.html)

### React/JavaScript
- [React Documentation](https://react.dev/)
- [JavaScript Guide](https://javascript.info/)
- [Tailwind CSS](https://tailwindcss.com/)

### Project-Specific
- See ARCHITECTURE.md for system design
- See API_DOCS.md for endpoint details
- See code comments for implementation details

---

## 🏆 Contributing Tips

1. **Start small** - Fix typos, improve docs
2. **Read the code** - Understand before changing
3. **Test thoroughly** - Break nothing
4. **Ask questions** - In comments or issues
5. **Be respectful** - Community is important
6. **Have fun** - Open source should be enjoyable

---

## 📞 Questions?

- Check README.md
- Check TROUBLESHOOTING.md
- Open an issue
- Join discussions

---

## ✨ Thank You!

Your contributions help make this project better for everyone.

### Contributors
See GitHub contributors page for all who helped.

---

**Happy Contributing!** 🎉
