import {
  Activity, AlertTriangle, ArrowLeft, ArrowLeftRight, ArrowRight, ArrowUpDown, ArrowUpRight, AtSign, Award,
  BadgeCheck, BarChart3, Bell, Blocks, Bookmark, BookmarkCheck, BookOpen, BookOpenCheck, Boxes, Brain, Briefcase, Calculator,
  Building2, Calendar, CalendarCheck, CalendarDays, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight,
  ChevronUp, Circle, CircleDot, ClipboardList, Clock, Code2, Coins, Compass, Copy, CreditCard, Database, Download, Eye, EyeOff,
  FileText, Filter, Flag, FlaskConical, Flame, Gauge, Gift, Github, Globe, GraduationCap, Handshake, Heart, HeartHandshake, HelpCircle,
  IndianRupee, Info, Layers, LayoutDashboard, Lightbulb, LineChart, Link2, Linkedin, Lock, LogOut, Mail, MapPin,
  Maximize2, Megaphone, Menu, MessageCircle, MessagesSquare, Mic, Minus, Moon, MoreHorizontal, Network, PackageCheck,
  Palette, PanelLeft, Pause, PenLine, PieChart, Play, PlayCircle, Plus, Presentation, Puzzle, Quote, RefreshCw,
  Repeat, Rocket, RotateCcw, Route, Save, ScanSearch, Search, Send, Settings, Share2, Shield, ShieldCheck,
  SlidersHorizontal, Sparkles, Star, Sun, Swords, Table2, Target, ThumbsUp, Timer, Trash2, TrendingUp, Trophy,
  Unlock, Upload, UserCheck, UserPlus, Users, UsersRound, UserRoundPlus, Video, Wallet, Wand2, Zap, X, XCircle,
} from 'lucide-react'

export const ICONS = {
  Activity, AlertTriangle, ArrowLeft, ArrowLeftRight, ArrowRight, ArrowUpDown, ArrowUpRight, AtSign, Award,
  BadgeCheck, BarChart3, Bell, Blocks, Bookmark, BookmarkCheck, BookOpen, BookOpenCheck, Boxes, Brain, Briefcase, Calculator,
  Building2, Calendar, CalendarCheck, CalendarDays, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight,
  ChevronUp, Circle, CircleDot, ClipboardList, Clock, Code2, Coins, Compass, Copy, CreditCard, Database, Download, Eye, EyeOff,
  FileText, Filter, Flag, FlaskConical, Flame, Gauge, Gift, Github, Globe, GraduationCap, Handshake, Heart, HeartHandshake, HelpCircle,
  IndianRupee, Info, Layers, LayoutDashboard, Lightbulb, LineChart, Link2, Linkedin, Lock, LogOut, Mail, MapPin,
  Maximize2, Megaphone, Menu, MessageCircle, MessagesSquare, Mic, Minus, Moon, MoreHorizontal, Network, PackageCheck,
  Palette, PanelLeft, Pause, PenLine, PieChart, Play, PlayCircle, Plus, Presentation, Puzzle, Quote, RefreshCw,
  Repeat, Rocket, RotateCcw, Route, Save, ScanSearch, Search, Send, Settings, Share2, Shield, ShieldCheck,
  SlidersHorizontal, Sparkles, Star, Sun, Swords, Table2, Target, ThumbsUp, Timer, Trash2, TrendingUp, Trophy,
  Unlock, Upload, UserCheck, UserPlus, Users, UsersRound, UserRoundPlus, Video, Wallet, Wand2, Zap, X, XCircle,
}

/** Renders a lucide icon by its registry name. Falls back gracefully. */
export default function Icon({ name, ...rest }) {
  const Cmp = ICONS[name] || Sparkles
  return <Cmp {...rest} />
}
