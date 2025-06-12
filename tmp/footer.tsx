{/* Footer */}
      <footer className="border-t border-zinc-200 py-10 px-4 md:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center">
              <Logo size="sm" />
            </div>
            <div className="flex items-center gap-8">
              <Link href="/privacy" className="text-sm text-zinc-500 hover:text-black transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-zinc-500 hover:text-black transition-colors">
                Terms
              </Link>
              <span className="h-4 w-px bg-zinc-200 mx-1"></span>
              <Link href="mailto:help@qualified.com" className="text-sm text-zinc-500 hover:text-black transition-colors">
                help@qualified.com
              </Link>
            </div>
          </div>
        </div>
      </footer>
