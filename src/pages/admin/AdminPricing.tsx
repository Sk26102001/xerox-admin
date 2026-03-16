import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, RotateCcw, Edit2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  calculatePrice, getPriceForConfig,
  allPaperSizes, allPaperTypes, allBindingTypes, allQuantityTiers,
  paperTypeLabels, paperSizeLabels, bindingLabels, quantityTierLabels,
  defaultPricingConfig,
  type PaperSize, type PaperType, type PrintSide, type BindingType, type PrintColor, type PricingConfig,
} from '@/data/pricingData';

const deepClone = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));

const AdminPricing = () => {
  const { pricingConfig, setPricingConfig } = useApp();

  // Local draft for editing
  const [draft, setDraft] = useState<PricingConfig>(() => deepClone(pricingConfig));
  const [editMode, setEditMode] = useState(false);

  // View filters
  const [viewSize, setViewSize] = useState<PaperSize>('A4');
  const [viewSide, setViewSide] = useState<PrintSide>('double');

  // Preview calculator state
  const [pages, setPages] = useState(100);
  const [copies, setCopies] = useState(1);
  const [pSize, setPSize] = useState<PaperSize>('A4');
  const [pType, setPType] = useState<PaperType>('70gsm_normal');
  const [pColor, setPColor] = useState<PrintColor>('bw');
  const [pSide, setPSide] = useState<PrintSide>('double');
  const [pBinding, setPBinding] = useState<BindingType>('soft_cover');

  const activeConfig = editMode ? draft : pricingConfig;

  const preview = useMemo(() =>
    calculatePrice({ pages, copies, paperSize: pSize, paperType: pType, printColor: pColor, printSide: pSide, bindingType: pBinding }, activeConfig),
    [pages, copies, pSize, pType, pColor, pSide, pBinding, activeConfig]
  );

  const handlePriceChange = (paperType: PaperType, tier: typeof allQuantityTiers[number], value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return;
    setDraft(prev => {
      const next = deepClone(prev);
      const table = viewSide === 'double' ? next.doubleSidePrices : next.singleSidePrices;
      table[viewSize][tier][paperType] = num;
      return next;
    });
  };

  const handleBindingChange = (binding: BindingType, value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return;
    setDraft(prev => {
      const next = deepClone(prev);
      next.bindingPrices[binding] = num;
      return next;
    });
  };

  const handleSave = () => {
    setPricingConfig(deepClone(draft));
    setEditMode(false);
    toast.success('Pricing saved successfully!');
  };

  const handleReset = () => {
    setDraft(deepClone(defaultPricingConfig));
    toast.info('Pricing reset to defaults');
  };

  const handleCancel = () => {
    setDraft(deepClone(pricingConfig));
    setEditMode(false);
  };

  const gstPercent = activeConfig.gstRate * 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Pricing Management</h1>
        <div className="flex gap-2">
          {!editMode ? (
            <Button onClick={() => { setDraft(deepClone(pricingConfig)); setEditMode(true); }} className="gap-2">
              <Edit2 className="h-4 w-4" /> Edit Pricing
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleReset} className="gap-2">
                <RotateCcw className="h-4 w-4" /> Reset Defaults
              </Button>
              <Button variant="outline" onClick={handleCancel}>Cancel</Button>
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" /> Save Changes
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Price Tables */}
        <div className="xl:col-span-2 space-y-6">
          {/* General Settings */}
          {editMode && (
            <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
              <h2 className="font-semibold text-foreground mb-4">General Settings</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Color Multiplier</Label>
                  <Input
                    type="number" step="0.1" min="1"
                    value={draft.colorMultiplier}
                    onChange={e => setDraft(prev => ({ ...prev, colorMultiplier: parseFloat(e.target.value) || 1 }))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Color price = B&W price × this value</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">GST Rate (%)</Label>
                  <Input
                    type="number" step="0.5" min="0" max="100"
                    value={draft.gstRate * 100}
                    onChange={e => setDraft(prev => ({ ...prev, gstRate: (parseFloat(e.target.value) || 0) / 100 }))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Applied on total cost</p>
                </div>
              </div>
            </div>
          )}

          {/* Per-Page Price Table */}
          <div className="bg-card rounded-xl p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <h2 className="font-semibold text-foreground">Per-Page Prices (₹/page)</h2>
              <Select value={viewSize} onValueChange={(v) => setViewSize(v as PaperSize)}>
                <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
                <SelectContent>{allPaperSizes.map(s => <SelectItem key={s} value={s}>{paperSizeLabels[s]}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={viewSide} onValueChange={(v) => setViewSide(v as PrintSide)}>
                <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single Side</SelectItem>
                  <SelectItem value="double">Double Side</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Tabs defaultValue="bw">
              <TabsList className="mb-4">
                <TabsTrigger value="bw">B&W Prices</TabsTrigger>
                <TabsTrigger value="color">Color Prices (×{activeConfig.colorMultiplier})</TabsTrigger>
              </TabsList>

              {['bw', 'color'].map(colorTab => (
                <TabsContent key={colorTab} value={colorTab}>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[160px]">Paper Type</TableHead>
                          {allQuantityTiers.map(t => <TableHead key={t} className="text-center min-w-[100px]">{quantityTierLabels[t]}</TableHead>)}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allPaperTypes.map(pt => (
                          <TableRow key={pt}>
                            <TableCell className="font-medium text-sm">{paperTypeLabels[pt]}</TableCell>
                            {allQuantityTiers.map(tier => {
                              const basePrice = getPriceForConfig(viewSize, pt, viewSide, tier, activeConfig);
                              const displayPrice = colorTab === 'color' ? basePrice * activeConfig.colorMultiplier : basePrice;

                              return (
                                <TableCell key={tier} className="text-center">
                                  {editMode && colorTab === 'bw' ? (
                                    <Input
                                      type="number" step="0.01" min="0"
                                      className="w-20 mx-auto text-center h-8 text-sm"
                                      value={basePrice}
                                      onChange={e => handlePriceChange(pt, tier, e.target.value)}
                                    />
                                  ) : (
                                    <span className={colorTab === 'color' ? 'text-primary font-semibold' : ''}>
                                      ₹{displayPrice.toFixed(2)}
                                    </span>
                                  )}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  {colorTab === 'color' && (
                    <p className="text-xs text-muted-foreground mt-2">Color prices are auto-calculated: B&W × {activeConfig.colorMultiplier}. Edit B&W tab to change base prices.</p>
                  )}
                </TabsContent>
              ))}
            </Tabs>

            <p className="text-xs text-muted-foreground mt-3">
              {editMode ? `Editing ${paperSizeLabels[viewSize]} / ${viewSide === 'double' ? 'Double' : 'Single'} side prices. Switch size/side to edit other combinations.` : `GST ${gstPercent}% applied on total.`}
            </p>
          </div>

          {/* Binding Prices */}
          <div className="bg-card rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-foreground mb-4">Binding Prices</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {allBindingTypes.map(b => (
                <div key={b} className="bg-muted rounded-lg p-4">
                  <p className="font-medium text-sm mb-2">{bindingLabels[b]}</p>
                  {editMode ? (
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-muted-foreground">₹</span>
                      <Input
                        type="number" step="1" min="0"
                        className="h-8 text-sm w-20"
                        value={draft.bindingPrices[b]}
                        onChange={e => handleBindingChange(b, e.target.value)}
                      />
                    </div>
                  ) : (
                    <p className="text-primary font-bold text-lg">₹{activeConfig.bindingPrices[b]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Live Price Calculator */}
        <div className="bg-navy rounded-xl p-6 shadow-sm text-secondary-foreground h-fit sticky top-6">
          <h2 className="font-semibold mb-4">Live Price Calculator</h2>
          <div className="space-y-3">
            <div>
              <Label className="text-secondary-foreground/70 text-xs">Pages</Label>
              <input type="number" min={1} value={pages} onChange={e => setPages(Number(e.target.value) || 1)}
                className="w-full bg-navy-light border border-navy-light rounded px-3 py-1.5 text-secondary-foreground text-sm" />
            </div>
            <div>
              <Label className="text-secondary-foreground/70 text-xs">Copies</Label>
              <input type="number" min={1} value={copies} onChange={e => setCopies(Number(e.target.value) || 1)}
                className="w-full bg-navy-light border border-navy-light rounded px-3 py-1.5 text-secondary-foreground text-sm" />
            </div>
            <div>
              <Label className="text-secondary-foreground/70 text-xs">Paper Size</Label>
              <Select value={pSize} onValueChange={(v) => setPSize(v as PaperSize)}>
                <SelectTrigger className="bg-navy-light border-navy-light text-secondary-foreground"><SelectValue /></SelectTrigger>
                <SelectContent>{allPaperSizes.map(s => <SelectItem key={s} value={s}>{paperSizeLabels[s]}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-secondary-foreground/70 text-xs">Paper Type</Label>
              <Select value={pType} onValueChange={(v) => setPType(v as PaperType)}>
                <SelectTrigger className="bg-navy-light border-navy-light text-secondary-foreground"><SelectValue /></SelectTrigger>
                <SelectContent>{allPaperTypes.map(p => <SelectItem key={p} value={p}>{paperTypeLabels[p]}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-secondary-foreground/70 text-xs">Color</Label>
                <Select value={pColor} onValueChange={(v) => setPColor(v as PrintColor)}>
                  <SelectTrigger className="bg-navy-light border-navy-light text-secondary-foreground"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="bw">B&W</SelectItem><SelectItem value="color">Color</SelectItem></SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-secondary-foreground/70 text-xs">Side</Label>
                <Select value={pSide} onValueChange={(v) => setPSide(v as PrintSide)}>
                  <SelectTrigger className="bg-navy-light border-navy-light text-secondary-foreground"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="single">Single</SelectItem><SelectItem value="double">Double</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-secondary-foreground/70 text-xs">Binding</Label>
              <Select value={pBinding} onValueChange={(v) => setPBinding(v as BindingType)}>
                <SelectTrigger className="bg-navy-light border-navy-light text-secondary-foreground"><SelectValue /></SelectTrigger>
                <SelectContent>{allBindingTypes.map(b => <SelectItem key={b} value={b}>{bindingLabels[b]}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-navy-light space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-secondary-foreground/70">Per Page</span><span>₹{preview.pricePerPage.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-secondary-foreground/70">Printing</span><span>₹{preview.printingCost.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-secondary-foreground/70">Binding</span><span>₹{preview.bindingCost.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-secondary-foreground/70">GST ({gstPercent}%)</span><span>₹{preview.gst.toFixed(2)}</span></div>
            <div className="border-t border-navy-light pt-2 mt-2 flex justify-between font-bold text-lg">
              <span>Total</span><span className="text-primary">₹{preview.grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPricing;




