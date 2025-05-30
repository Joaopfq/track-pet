"use client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Share2Icon, CopyIcon, MailIcon } from "lucide-react";
import { FaWhatsappSquare, FaFacebookSquare, FaLinkedin } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";


type ShareDropdownProps = {
  url: string;
  title?: string;
};

export default function ShareDropdown({ url, title }: ShareDropdownProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title || "");

  const shareLinks = [
    {
      label: "WhatsApp",
      icon: <FaWhatsappSquare className="text-green-600" />,
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    },
    {
      label: "X (Twitter)",
      icon: <FaSquareXTwitter className="w-4 h-4 text-gray-100" />,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      label: "Facebook",
      icon: <FaFacebookSquare className="w-4 h-4 text-blue-700" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: "LinkedIn",
      icon: <FaLinkedin className="w-4 h-4 text-blue-700" />,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
    },
  ];

  function handleCopy() {
    navigator.clipboard.writeText(url);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Share">
          <Share2Icon className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {shareLinks.map((item) => (
          <DropdownMenuItem key={item.label} asChild>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 cursor-pointer"
            >
              {item.icon}
              {item.label}
            </a>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem onClick={handleCopy} className="flex items-center gap-2 cursor-pointer">
          <CopyIcon className="w-4 h-4" /> Copiar link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}