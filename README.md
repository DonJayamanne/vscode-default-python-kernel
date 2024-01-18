# Default Python Kernels for Jupyter Notebooks

This extension automatically selects the active Python Environment as a Kernel for a Jupyter Notebook opened in VS Code.

This is useful when you have multiple Python environments and want to use the one that is currently selected in the Python extension, by passing the Kernel Picker entirely.

## Note:
* To set the active Python environment use the command `Python: Select Interpreter`.
* Automatic selection works only for the first time a notebook is opened (once this extension has been installed).
    * I.e. if you change the active Python environment after opening a notebook, the Kernel will not be changed.
    * Or if you open a notebook and then change the active Python environment, the Kernel will not be changed.
* Similarly if you change the kernel manually, the kernel will never be changed automatically again.
