;;; export-org.el --- Export Org posts for the Jekyll build -*- lexical-binding: t; -*-

;;; Commentary:
;; This script writes only to the build staging directory.  It leaves the
;; checked-in Org and Markdown sources unchanged.

;;; Code:

(require 'ox-html)

(defun ashgillman--missing-include-p ()
  "Return non-nil when the current Org buffer includes an unavailable file."
  (save-excursion
    (goto-char (point-min))
    (let ((case-fold-search t)
          missing)
      (while (re-search-forward "^#\\+INCLUDE:[ \\t]+\\\"?\\([^\\\" \\t\\n]+\\)" nil t)
        (let ((included-file
               (expand-file-name (match-string 1)
                                 (file-name-directory buffer-file-name))))
          (unless (file-exists-p included-file)
            (setq missing included-file))))
      missing)))

(defun ashgillman--modernize-raw-html-blocks ()
  "Translate legacy raw HTML blocks in the current buffer for current Org."
  (save-excursion
    (let ((case-fold-search t))
      (goto-char (point-min))
      (while (re-search-forward "^#\\+BEGIN_HTML[ \\t]*$" nil t)
        (replace-match "#+begin_export html" t t))
      (goto-char (point-min))
      (while (re-search-forward "^#\\+END_HTML[ \\t]*$" nil t)
        (replace-match "#+end_export" t t)))))

(defun ashgillman-export-org (source-directory build-directory)
  "Export canonical Org posts from SOURCE-DIRECTORY into BUILD-DIRECTORY.

When a post has a Markdown source with the same basename, the Markdown file
remains canonical and the Org file is not exported."
  (let* ((posts-directory (expand-file-name "_posts/" source-directory))
         (build-posts-directory (expand-file-name "_posts/" build-directory)))
    (make-directory build-posts-directory t)
    (dolist (org-file (directory-files posts-directory t "\\.org\\'"))
      (let* ((basename (file-name-base org-file))
             (markdown-file (expand-file-name (concat basename ".md") posts-directory))
             (output-file (expand-file-name (concat basename ".html") build-posts-directory)))
        (unless (file-exists-p markdown-file)
          (with-current-buffer (find-file-noselect org-file)
            (let ((missing-include (ashgillman--missing-include-p)))
              (if missing-include
                  (message "Keeping legacy HTML for %s; missing include: %s"
                           (file-name-nondirectory org-file) missing-include)
                (ashgillman--modernize-raw-html-blocks)
                (let ((org-export-show-temporary-export-buffer nil)
                      (org-export-use-babel nil)
                      ;; The historic source includes unresolved internal links
                      ;; accepted by its original exporter. Keep exporting them.
                      (org-export-with-broken-links t)
                      (org-html-htmlize-output-type nil)
                      (org-html-preamble nil)
                      (org-html-postamble nil)
                      (org-export-with-author nil)
                      (org-export-with-date nil)
                      (org-export-with-title nil))
                  (org-export-to-file 'html output-file nil nil nil t))))))))))

(provide 'export-org)
;;; export-org.el ends here
