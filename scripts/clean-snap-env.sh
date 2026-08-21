#!/usr/bin/env sh
# When Playwright is launched from a snap-packaged IDE (e.g. VS Code snap), the
# snap injects GTK/GIO variables pointing at /snap/core20 libraries. WebKit picks
# them up and crashes ("symbol lookup error ... libpthread.so.0"). Chromium and
# Firefox are unaffected. This wrapper runs the given command with those
# variables removed. Usage: ./scripts-clean-snap-env.sh npx playwright test
exec env -u GTK_EXE_PREFIX -u GIO_MODULE_DIR -u GSETTINGS_SCHEMA_DIR -u GTK_PATH \
  -u GTK_IM_MODULE_FILE -u LOCPATH -u XDG_DATA_HOME -u GDK_PIXBUF_MODULE_FILE \
  -u GDK_PIXBUF_MODULEDIR -u XDG_DATA_DIRS -u LD_LIBRARY_PATH "$@"
