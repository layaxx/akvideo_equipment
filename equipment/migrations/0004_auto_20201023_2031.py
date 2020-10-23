# Generated by Django 3.1.2 on 2020-10-23 18:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('equipment', '0003_auto_20201018_2342'),
    ]

    operations = [
        migrations.AddField(
            model_name='device',
            name='verified',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='device',
            name='amount',
            field=models.IntegerField(verbose_name='Menge'),
        ),
        migrations.AlterField(
            model_name='device',
            name='brand',
            field=models.TextField(blank=True, default='', verbose_name='Marke (z.B. Sony)'),
        ),
        migrations.AlterField(
            model_name='device',
            name='category',
            field=models.TextField(default='Sonstiges', verbose_name='Kategorien (durch Komma getrennt)'),
        ),
        migrations.AlterField(
            model_name='device',
            name='comments',
            field=models.TextField(blank=True, default='', verbose_name='Anmerkungen'),
        ),
        migrations.AlterField(
            model_name='device',
            name='container',
            field=models.TextField(blank=True, default='', verbose_name='Behälter (z.B. Tontasche)'),
        ),
        migrations.AlterField(
            model_name='device',
            name='date',
            field=models.DateField(verbose_name='Kaufdatum'),
        ),
        migrations.AlterField(
            model_name='device',
            name='description',
            field=models.TextField(verbose_name='Bezeichnung'),
        ),
        migrations.AlterField(
            model_name='device',
            name='index',
            field=models.IntegerField(verbose_name='Index'),
        ),
        migrations.AlterField(
            model_name='device',
            name='location',
            field=models.TextField(verbose_name='Standort (z.B. Medienraum)'),
        ),
        migrations.AlterField(
            model_name='device',
            name='location_prec',
            field=models.TextField(blank=True, default='', verbose_name='genauerer Standort (z.B. Stahlschrank)'),
        ),
        migrations.AlterField(
            model_name='device',
            name='price',
            field=models.DecimalField(decimal_places=2, max_digits=7, verbose_name='Kaufpreis'),
        ),
        migrations.AlterField(
            model_name='device',
            name='store',
            field=models.TextField(blank=True, default='', verbose_name='Geschäft'),
        ),
    ]
