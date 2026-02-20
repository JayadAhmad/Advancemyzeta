import { cn } from '@/lib/utils';
import { Badge } from '@/Components/ui/badge';

const variantStyles = {
  default: 'bg-card hover:bg-muted/50',
  success: 'bg-success/5 border-success/20 hover:bg-success/10',
  warning: 'bg-warning/5 border-warning/20 hover:bg-warning/10',
  destructive: 'bg-destructive/5 border-destructive/20 hover:bg-destructive/10',
  info: 'bg-info/5 border-info/20 hover:bg-info/10',
};

const iconVariantStyles = {
  default: 'bg-primary/10 text-primary',
  success: 'bg-success/20 text-success',
  warning: 'bg-warning/20 text-warning',
  destructive: 'bg-destructive/20 text-destructive',
  info: 'bg-info/20 text-info',
};

export const KPITile = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  badge,
  badgeVariant,
  onClick,
  className,
}) => {
  const getBadgeVariant = () => {
    if (badgeVariant === 'destructive') return 'destructive';
    if (badgeVariant === 'warning' || badgeVariant === 'success') return 'secondary';
    return 'secondary';
  };

  const getBadgeClassName = () => {
    if (badgeVariant === 'warning') return 'bg-warning/20 text-warning border-warning/30';
    if (badgeVariant === 'success') return 'bg-success/20 text-success border-success/30';
    return '';
  };

  const getTrendIcon = (isPositive) => {
    return isPositive ? '↑' : '↓';
  };

  const getTrendColor = (isPositive) => {
    return isPositive ? 'text-success' : 'text-destructive';
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative rounded-lg border p-4 transition-all',
        variantStyles[variant],
        onClick && 'cursor-pointer',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className={cn('rounded-lg p-2', iconVariantStyles[variant])}>
          {Icon && <Icon className="h-4 w-4" />}
        </div>
        {badge && (
          <Badge
            variant={getBadgeVariant()}
            className={cn(
              'text-[10px]',
              getBadgeClassName()
            )}
          >
            {badge}
          </Badge>
        )}
      </div>
      <div className="mt-3">
        <p className="text-xs text-muted-foreground font-medium">{title}</p>
        <p className="text-2xl font-bold mt-0.5 mono">{value}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        )}
        {trend && (
          <div className="flex items-center gap-1 mt-1">
            <span
              className={cn(
                'text-xs font-medium',
                getTrendColor(trend.isPositive)
              )}
            >
              {getTrendIcon(trend.isPositive)} {Math.abs(trend.value)}%
            </span>
            <span className="text-[10px] text-muted-foreground">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KPITile
